import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// ─── Telegram types ────────────────────────────────────────────────────────

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    chat?: {
      id: number | string;
    };
    text?: string;
    caption?: string;
    reply_to_message?: {
      message_id: number;
      text?: string;
      caption?: string;
    };
  };
}

// ─── Supabase Broadcast (server-side REST API) ─────────────────────────────
// Push đồng thời vào cả `chat:<sessionId>` và `realtime:chat:<sessionId>`
// để tương thích hoàn toàn với tất cả cấu hình Realtime client.

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
        messages: [
          {
            topic: `chat:${sessionId}`,
            event: "new_message",
            payload,
          },
          {
            topic: `realtime:chat:${sessionId}`,
            event: "new_message",
            payload,
          },
        ],
      }),
    });
  } catch (err) {
    console.error("[broadcast]", err);
  }
}

// ─── POST /api/telegram-webhook ────────────────────────────────────────────
// Telegram gọi endpoint này mỗi khi có tin nhắn mới vào bot.

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

    // Hỗ trợ cả text và caption (nếu admin gửi kèm ảnh)
    const replyText = msg?.text || msg?.caption;

    // Bỏ qua nếu không có nội dung chữ
    if (!replyText || !msg) {
      return NextResponse.json({ ok: true });
    }

    const db = createServerClient();
    let targetSessionId: string | undefined;

    // Trường hợp 1: Admin dùng chức năng Reply
    if (msg.reply_to_message) {
      const replyToMsgId = msg.reply_to_message.message_id;

      // 1.1 Tìm session từ telegram_message_id của tin nhắn gốc
      const { data: original } = await db
        .from("chat_messages")
        .select("session_id")
        .eq("telegram_message_id", replyToMsgId)
        .limit(1)
        .maybeSingle();

      targetSessionId = original?.session_id;

      // 1.2 Dự phòng: nếu không tìm thấy qua ID, tìm qua hashtag `#sid_xxxx`
      if (!targetSessionId) {
        const sourceText = msg.reply_to_message.text || msg.reply_to_message.caption || "";
        const match = sourceText.match(/#sid_([a-f0-9-]+)/i);
        if (match?.[1]) {
          const sidCandidate = match[1].toLowerCase();
          if (sidCandidate.length === 36) {
            // UUID đầy đủ
            const { data: session } = await db
              .from("chat_sessions")
              .select("id")
              .eq("id", sidCandidate)
              .maybeSingle();
            if (session) {
              targetSessionId = session.id;
            }
          } else {
            // Prefix 8 ký tự (tương thích tin nhắn cũ): lấy danh sách phiên gần đây và khớp prefix
            const { data: recentSessions } = await db
              .from("chat_sessions")
              .select("id")
              .order("created_at", { ascending: false })
              .limit(50);
            const matched = recentSessions?.find(s => s.id.toLowerCase().startsWith(sidCandidate));
            if (matched) {
              targetSessionId = matched.id;
            }
          }
        }
      }
    }

    // Trường hợp 2: Admin gõ tin nhắn trực tiếp cho bot mà KHÔNG bấm Reply (hoặc không tìm được qua reply)
    // Tự động gán vào phiên chat có tin nhắn mới nhất
    if (!targetSessionId) {
      const adminChatId = process.env.TELEGRAM_CHAT_ID;
      const incomingChatId = msg.chat?.id ? String(msg.chat.id) : undefined;

      // Chỉ kích hoạt tự động nếu tin nhắn đến từ đúng admin chat ID
      if (!adminChatId || incomingChatId === String(adminChatId).trim()) {
        // Ưu tiên tìm session từ tin nhắn của khách gần nhất trong chat_messages
        const { data: latestUserMsg } = await db
          .from("chat_messages")
          .select("session_id")
          .eq("role", "user")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestUserMsg?.session_id) {
          targetSessionId = latestUserMsg.session_id;
        } else {
          const { data: latestSession } = await db
            .from("chat_sessions")
            .select("id")
            .eq("status", "open")
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (latestSession) {
            targetSessionId = latestSession.id;
          }
        }
      }
    }

    if (!targetSessionId) {
      // Tin nhắn không thuộc phiên chat nào — bỏ qua an toàn
      console.warn("[telegram-webhook] Không tìm thấy session phù hợp cho tin nhắn:", replyText);
      return NextResponse.json({ ok: true, warning: "No matching session found" });
    }

    // 3. Lưu phản hồi của admin vào Supabase kèm telegram_message_id
    // Việc lưu telegram_message_id giúp admin có thể reply tiếp vào chính tin nhắn này (chuỗi reply)
    const { data: newMsg, error: insertErr } = await db
      .from("chat_messages")
      .insert({
        session_id: targetSessionId,
        role: "admin",
        text: replyText,
        telegram_message_id: msg.message_id,
      })
      .select("id, created_at")
      .single();

    if (insertErr || !newMsg) {
      console.error("[telegram-webhook] Insert message error:", insertErr);
      return NextResponse.json({ ok: true, error: insertErr?.message });
    }

    console.log(`[telegram-webhook] ✅ Đã lưu phản hồi vào session ${targetSessionId}: "${replyText}"`);

    // 4. Broadcast tới widget của khách (qua Realtime Broadcast)
    // Lưu ý: bảng chat_messages có kích hoạt Realtime publication nên
    // nếu widget subscribe postgres_changes thì sự kiện cũng đã tự động được gửi đi!
    await broadcastToSession(targetSessionId, {
      id: newMsg.id,
      text: replyText,
      created_at: newMsg.created_at,
    });

    return NextResponse.json({ ok: true, sessionId: targetSessionId, messageId: newMsg.id });
  } catch (err) {
    console.error("[telegram-webhook]", err);
    // Luôn trả 200 để Telegram không retry liên tục
    return NextResponse.json({ ok: true });
  }
}

