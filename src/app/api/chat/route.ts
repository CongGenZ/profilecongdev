import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase";

// ─── Schema ────────────────────────────────────────────────────────────────

const bodySchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().optional(),
});

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string | null;
  sessionId: string;
}

// ─── Telegram helper ───────────────────────────────────────────────────────

// Heuristic: trích tên từ tin nhắn đầu (VD: "Mình tên Cong", "Hi, tôi là Nam")
function extractName(message: string): string | null {
  const patterns = [
    /(?:mình|tôi|tao|tui|em|anh|chị)\s+(?:tên|là|tên là)\s+([A-Za-zÀ-ỹ]+)/i,
    /(?:tên|name)[:\s]+([A-Za-zÀ-ỹ]+)/i,
    /(?:hi|hello|chào)[,\s]+(?:mình|tôi|tao|tui|em|anh|chị)?\s*(?:tên|là|tên là)?\s*([A-Za-zÀ-ỹ]{2,})/i,
  ];
  for (const re of patterns) {
    const match = message.match(re);
    if (match?.[1]) return match[1];
  }
  return null;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegramMessage(text: string): Promise<number | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("[chat/telegram] Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong env");
    return null;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    const data = (await res.json()) as { ok: boolean; result?: { message_id: number }; description?: string; error_code?: number };
    if (!data.ok) {
      console.error("[chat/telegram] Lỗi từ Telegram API:", data.error_code, data.description);
      return null;
    }
    return data.result?.message_id ?? null;
  } catch (err) {
    console.error("[chat/telegram] Lỗi kết nối Telegram:", err);
    return null;
  }
}

// ─── POST /api/chat ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    const { message, sessionId } = parsed.data;
    const db = createServerClient();

    // 1. Tạo session mới hoặc lấy visitor_name đã lưu
    let sid = sessionId;
    let visitorName: string | null = null;

    if (sid) {
      const { data: existing } = await db
        .from("chat_sessions")
        .select("id, visitor_name")
        .eq("id", sid)
        .maybeSingle();

      if (existing) {
        visitorName = existing.visitor_name ?? null;
        // Cập nhật updated_at để đánh dấu phiên hoạt động mới nhất
        await db
          .from("chat_sessions")
          .update({ updated_at: new Date().toISOString(), status: "open" })
          .eq("id", sid);
      } else {
        // Nếu sessionId cũ trong localStorage không còn tồn tại trong DB → tạo mới
        sid = undefined;
      }
    }

    if (!sid) {
      const { data: session, error } = await db
        .from("chat_sessions")
        .insert({ status: "open" })
        .select("id")
        .single();
      if (error || !session) throw error ?? new Error("Cannot create session");
      sid = session.id;
    }

    // Lần đầu gửi tin → lưu tên nếu có thể trích từ tin nhắn
    // (heuristic đơn giản: tin đầu thường có tên)
    if (!visitorName) {
      visitorName = extractName(message);
      if (visitorName) {
        await db
          .from("chat_sessions")
          .update({ visitor_name: visitorName })
          .eq("id", sid);
      }
    }

    // 2. Lưu tin nhắn của khách vào DB
    const { data: savedMsg, error: msgErr } = await db
      .from("chat_messages")
      .insert({ session_id: sid, role: "user", text: message })
      .select("id")
      .single();
    if (msgErr || !savedMsg) throw msgErr ?? new Error("Cannot save message");

    // 3. Gửi thông báo Telegram
    const safeVisitorName = visitorName ? escapeHtml(visitorName) : null;
    const safeMessage = escapeHtml(message);
    const label = safeVisitorName ? `👤 <b>${safeVisitorName}</b>` : "👤 Khách (chưa rõ tên)";
    const telegramText =
      `💬 <b>Tin nhắn mới</b> — ${label}\n` +
      `<code>#sid_${sid}</code>\n\n` +
      `${safeMessage}\n\n` +
      `<i>↩️ Reply tin nhắn này để trả lời.</i>`;

    const telegramMsgId = await sendTelegramMessage(telegramText);

    // 4. Lưu telegram_message_id để map reply về đúng session
    if (telegramMsgId) {
      await db
        .from("chat_messages")
        .update({ telegram_message_id: telegramMsgId })
        .eq("id", savedMsg.id);
    }

    return NextResponse.json({ reply: null, sessionId: sid } satisfies ChatResponse);
  } catch (err) {
    console.error("[chat/route]", err);
    return NextResponse.json({ error: "Lỗi server. Vui lòng thử lại." }, { status: 500 });
  }
}

// ─── GET /api/chat?sessionId=<id> ──────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ messages: [] });
    }

    const db = createServerClient();
    const { data, error } = await db
      .from("chat_messages")
      .select("id, role, text, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[chat/get]", error);
      return NextResponse.json({ error: "Không thể lấy lịch sử chat." }, { status: 500 });
    }

    const messages = (data ?? []).map(m => ({
      id: m.id,
      role: m.role as "user" | "bot" | "admin",
      text: m.text,
      time: new Date(m.created_at).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      created_at: m.created_at,
    }));

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[chat/get]", err);
    return NextResponse.json({ error: "Lỗi server." }, { status: 500 });
  }
}

