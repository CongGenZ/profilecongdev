import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase";
import {
  registerTelegramMessageSession,
  syncTelegramUpdates,
} from "@/lib/telegram";
import { profile } from "@/data/profile";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// ─── Rate Limiter (Chống spam API & Telegram) ──────────────────────────────

const checkRateLimit = createRateLimiter(15, 60_000);

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
  replyId?: string;
  sessionId: string;
}

// ─── Smart Auto-Responder (Trợ lý tư vấn tự động 24/7 + Chuyển tiếp Telegram) ─

function generateSmartReply(message: string, visitorName: string | null): string {
  const lower = message.toLowerCase();
  const greeting = visitorName ? `Chào ${visitorName}! ` : "";

  if (
    lower.includes("báo giá") ||
    lower.includes("chi phí") ||
    lower.includes("giá") ||
    lower.includes("bao nhiêu tiền") ||
    lower.includes("ngân sách")
  ) {
    return (
      `${greeting}Dưới đây là mức chi phí & thời gian tham khảo cho các gói dịch vụ của Công:\n` +
      `• Landing Page / Web Doanh nghiệp: 5 – 9 triệu (1 – 2 tuần)\n` +
      `• Website E-Commerce / Bán hàng: 12 – 20 triệu (3 – 5 tuần)\n` +
      `• Web App / SaaS / Hệ thống quản lý: 15 – 28 triệu (4 – 7 tuần)\n` +
      `• Bảo trì & Nâng cấp tính năng: từ 3 triệu\n\n` +
      `💡 Bạn có thể dùng mục "Ước tính chi phí" ngay trên trang để tính chi tiết. Tin nhắn của bạn cũng đã được gửi tới Telegram của Công để tư vấn trực tiếp!`
    );
  }

  if (
    lower.includes("công nghệ") ||
    lower.includes("tech") ||
    lower.includes("stack") ||
    lower.includes("kinh nghiệm") ||
    lower.includes(".net") ||
    lower.includes("next.js")
  ) {
    return (
      `${greeting}Công có 2+ năm kinh nghiệm thực chiến Full-stack với:\n` +
      `• Frontend: Next.js, React, TypeScript, Tailwind CSS\n` +
      `• Backend: .NET / C# Microservices, Node.js, NestJS, REST API\n` +
      `• Database & Cloud: PostgreSQL, Supabase, MySQL, Prisma, Redis, Docker, Vercel\n\n` +
      `Bạn đang dự định xây dựng hệ thống bằng công nghệ nào? Cứ nhắn thêm nhé, Công sẽ phản hồi qua Telegram ngay!`
    );
  }

  if (
    lower.includes("dự án") ||
    lower.includes("project") ||
    lower.includes("portfolio") ||
    lower.includes("đã làm")
  ) {
    return (
      `${greeting}Một số dự án tiêu biểu Công đã triển khai:\n` +
      `1. Global CSE Juniors: Nền tảng giáo dục quốc tế (.NET Microservices + React + PostgreSQL)\n` +
      `2. E-Commerce Platform: Hệ thống bán lẻ tự động hóa đơn hàng & thanh toán VNPay\n` +
      `3. Smart Restaurant POS: Phần mềm quản lý bàn & đồng bộ màn hình bếp Realtime\n` +
      `4. Team Task & Sprint Management: Quản lý dự án Kanban kéo thả qua Socket.io\n\n` +
      `Bạn muốn tìm hiểu sâu hơn về dự án nào?`
    );
  }

  if (
    lower.includes("liên hệ") ||
    lower.includes("zalo") ||
    lower.includes("số điện thoại") ||
    lower.includes("sđt") ||
    lower.includes("email") ||
    lower.includes("cv")
  ) {
    return (
      `${greeting}Bạn có thể liên hệ nhanh với Công qua:\n` +
      `• Hotline / Zalo: ${profile.phone}\n` +
      `• Email: ${profile.email}\n` +
      `• GitHub: ${profile.github}\n` +
      `• Địa chỉ: ${profile.location}\n\n` +
      `Hoặc bạn cứ nhắn trực tiếp tại khung chat này, tin nhắn được kết nối thẳng tới Telegram cá nhân của Công!`
    );
  }

  return (
    `${greeting}Mình đã nhận được tin nhắn của bạn và chuyển trực tiếp tới Telegram của Công Dev ⏳\n` +
    `Công sẽ phản hồi bạn ngay tại khung chat này trong thời gian sớm nhất (hoặc bạn có thể gọi/Zalo nhanh qua số ${profile.phone}).`
  );
}

// ─── Telegram helper ───────────────────────────────────────────────────────

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
    const data = (await res.json()) as {
      ok: boolean;
      result?: { message_id: number };
      description?: string;
      error_code?: number;
    };
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
    const ip = getClientIp(req.headers);

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Bạn gửi tin nhắn quá nhanh. Vui lòng đợi ít phút rồi thử lại nhé!" },
        { status: 429 }
      );
    }

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
        await db
          .from("chat_sessions")
          .update({ updated_at: new Date().toISOString(), status: "open" })
          .eq("id", sid);
      } else {
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

    // 3. Tạo phản hồi tự động thông minh và lưu vào DB
    const smartReplyText = generateSmartReply(message, visitorName);
    const { data: botMsg } = await db
      .from("chat_messages")
      .insert({ session_id: sid, role: "bot", text: smartReplyText })
      .select("id")
      .single();

    // 4. Gửi thông báo Telegram tới Admin
    const safeVisitorName = visitorName ? escapeHtml(visitorName) : null;
    const safeMessage = escapeHtml(message);
    const label = safeVisitorName ? `👤 <b>${safeVisitorName}</b>` : "👤 Khách (chưa rõ tên)";
    const telegramText =
      `💬 <b>Tin nhắn mới</b> — ${label}\n` +
      `<code>#sid_${sid}</code>\n\n` +
      `${safeMessage}\n\n` +
      `<i>↩️ Reply tin nhắn này để trả lời trực tiếp.</i>`;

    const telegramMsgId = await sendTelegramMessage(telegramText);

    // 5. Lưu telegram_message_id để map reply về đúng session
    if (telegramMsgId) {
      registerTelegramMessageSession(telegramMsgId, sid);
      const { error: updateErr } = await db
        .from("chat_messages")
        .update({ telegram_message_id: telegramMsgId })
        .eq("id", savedMsg.id);
      if (updateErr) {
        console.warn(
          "[chat/route] Không thể lưu telegram_message_id vào DB (đã lưu dự phòng trên RAM):",
          updateErr.message
        );
      }
    }

    return NextResponse.json({
      reply: smartReplyText,
      replyId: botMsg?.id,
      sessionId: sid,
    } satisfies ChatResponse);
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

    const host = req.headers.get("host") || "";
    const isLocalRequest =
      host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      host.startsWith("192.168.") ||
      host.startsWith("10.");

    await syncTelegramUpdates({
      isLocalRequest,
      preferredSessionId: sessionId,
      currentOrigin: req.nextUrl.origin,
    });

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

    const messages = (data ?? []).map((m) => ({
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
