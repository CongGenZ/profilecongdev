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

async function sendTelegramMessage(text: string): Promise<number | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    const data = await res.json() as { ok: boolean; result?: { message_id: number } };
    return data.ok ? (data.result?.message_id ?? null) : null;
  } catch (err) {
    console.error("[chat/telegram]", err);
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

    if (!sid) {
      const { data: session, error } = await db
        .from("chat_sessions")
        .insert({ status: "open" })
        .select("id")
        .single();
      if (error || !session) throw error ?? new Error("Cannot create session");
      sid = session.id;
    } else {
      const { data: existing } = await db
        .from("chat_sessions")
        .select("visitor_name")
        .eq("id", sid)
        .single();
      visitorName = existing?.visitor_name ?? null;
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
    const label = visitorName ? `👤 <b>${visitorName}</b>` : "👤 Khách (chưa rõ tên)";
    const telegramText =
      `💬 <b>Tin nhắn mới</b> — ${label}\n` +
      `<code>#sid_${sid.slice(0, 8)}</code>\n\n` +
      `${message}\n\n` +
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
