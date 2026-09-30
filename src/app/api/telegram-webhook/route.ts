import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// ─── Telegram types ────────────────────────────────────────────────────────

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    text?: string;
    reply_to_message?: {
      message_id: number;
    };
  };
}

// ─── Supabase Broadcast (server-side REST API) ─────────────────────────────
// Dùng REST thay vì JS client channel vì API route không giữ WebSocket lâu dài.
// Server push vào kênh chat:<sessionId> → widget nhận qua Broadcast subscription.

async function broadcastToSession(sessionId: string, payload: object) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  try {
    await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceKey}`,
        "apikey": serviceKey,
      },
      body: JSON.stringify({
        messages: [{
          topic: `realtime:chat:${sessionId}`,
          event: "new_message",
          payload,
        }],
      }),
    });
  } catch (err) {
    console.error("[broadcast]", err);
  }
}

// ─── POST /api/telegram-webhook ────────────────────────────────────────────
// Telegram gọi endpoint này mỗi khi có tin nhắn mới vào bot.
// Chỉ xử lý khi admin reply một tin nhắn (reply_to_message tồn tại).

export async function POST(req: NextRequest) {
  // Xác thực secret token (set khi đăng ký webhook với Telegram)
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (webhookSecret) {
    const token = req.headers.get("x-telegram-bot-api-secret-token");
    if (token !== webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const update: TelegramUpdate = await req.json();
    const msg = update.message;

    // Bỏ qua nếu không phải reply hoặc không có text
    if (!msg?.text || !msg.reply_to_message) {
      return NextResponse.json({ ok: true });
    }

    const replyToMsgId = msg.reply_to_message.message_id;
    const db = createServerClient();

    // Tìm session từ telegram_message_id của tin nhắn gốc
    const { data: original, error } = await db
      .from("chat_messages")
      .select("session_id")
      .eq("telegram_message_id", replyToMsgId)
      .single();

    if (error || !original) {
      // Admin reply tin nhắn không phải notification của bot — bỏ qua
      return NextResponse.json({ ok: true });
    }

    // Lưu phản hồi của admin vào Supabase
    const { data: newMsg } = await db
      .from("chat_messages")
      .insert({ session_id: original.session_id, role: "admin", text: msg.text })
      .select("id, created_at")
      .single();

    // Broadcast tới widget của khách — chỉ kênh chat:<uuid> đó mới nhận được
    if (newMsg) {
      await broadcastToSession(original.session_id, {
        id: newMsg.id,
        text: msg.text,
        created_at: newMsg.created_at,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[telegram-webhook]", err);
    // Luôn trả 200 để Telegram không retry liên tục
    return NextResponse.json({ ok: true });
  }
}
