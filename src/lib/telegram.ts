import { createServerClient } from "@/lib/supabase";

// ─── Telegram Types ────────────────────────────────────────────────────────

export interface TelegramMessage {
  message_id: number;
  from?: {
    id: number | string;
    is_bot?: boolean;
    first_name?: string;
    username?: string;
  };
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
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
}

// ─── In-memory State (giữ trạng thái giữa các request trên cùng Node process) ─

const globalForTelegram = globalThis as unknown as {
  __telegramOffset?: number;
  __telegramSyncPromise?: Promise<void> | null;
  __telegramLastSyncAt?: number;
  __telegramWebhookActiveUntil?: number;
  __telegramProcessedUpdateIds?: Set<number>;
  __telegramProcessedMsgIds?: Set<number>;
  __telegramMsgSessionMap?: Map<number, string>;
};

const processedUpdateIds =
  globalForTelegram.__telegramProcessedUpdateIds ??
  (globalForTelegram.__telegramProcessedUpdateIds = new Set<number>());

const processedMsgIds =
  globalForTelegram.__telegramProcessedMsgIds ??
  (globalForTelegram.__telegramProcessedMsgIds = new Set<number>());

const msgSessionMap =
  globalForTelegram.__telegramMsgSessionMap ??
  (globalForTelegram.__telegramMsgSessionMap = new Map<number, string>());

/**
 * Lưu mapping telegram_message_id -> sessionId ngay trên RAM
 * (Dự phòng trường hợp DB chưa có cột telegram_message_id hoặc lệnh UPDATE bị chặn).
 */
export function registerTelegramMessageSession(telegramMessageId: number, sessionId: string) {
  msgSessionMap.set(telegramMessageId, sessionId);
  if (msgSessionMap.size > 500) {
    const firstKey = msgSessionMap.keys().next().value;
    if (firstKey !== undefined) msgSessionMap.delete(firstKey);
  }
}

// ─── Supabase Broadcast (server-side REST API) ─────────────────────────────

export async function broadcastToSession(sessionId: string, payload: object) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  try {
    await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
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
    console.error("[telegram/broadcast]", err);
  }
}

// ─── Xử lý 1 Telegram Update (Dùng chung cho cả Webhook & Auto-Polling) ─────

export async function processTelegramUpdate(
  update: TelegramUpdate,
  preferredSessionId?: string
): Promise<{ ok: boolean; sessionId?: string; messageId?: string; skipped?: string }> {
  if (typeof update.update_id === "number") {
    if (processedUpdateIds.has(update.update_id)) {
      return { ok: true, skipped: "duplicate_update_id" };
    }
  }

  const msg = update.message ?? update.edited_message ?? update.channel_post;
  const replyText = (msg?.text || msg?.caption || "").trim();

  if (!msg || !replyText) {
    if (typeof update.update_id === "number") processedUpdateIds.add(update.update_id);
    return { ok: true, skipped: "empty_message" };
  }

  // Bỏ qua tin nhắn của chính bot hoặc lệnh /start
  if (msg.from?.is_bot || replyText === "/start") {
    if (typeof update.update_id === "number") processedUpdateIds.add(update.update_id);
    return { ok: true, skipped: "bot_or_command" };
  }

  // Chống xử lý trùng cùng 1 message_id từ Telegram
  if (processedMsgIds.has(msg.message_id)) {
    if (typeof update.update_id === "number") processedUpdateIds.add(update.update_id);
    return { ok: true, skipped: "duplicate_message_id" };
  }

  const db = createServerClient();

  // Kiểm tra trong DB xem telegram_message_id này đã được lưu chưa (bỏ qua lỗi nếu DB chưa có cột telegram_message_id)
  try {
    const { data: existingMsg, error: checkErr } = await db
      .from("chat_messages")
      .select("id, session_id")
      .eq("telegram_message_id", msg.message_id)
      .limit(1)
      .maybeSingle();

    if (!checkErr && existingMsg) {
      processedMsgIds.add(msg.message_id);
      if (typeof update.update_id === "number") processedUpdateIds.add(update.update_id);
      return {
        ok: true,
        sessionId: existingMsg.session_id,
        messageId: existingMsg.id,
        skipped: "already_in_db",
      };
    }
  } catch {
    // Bỏ qua nếu cột telegram_message_id chưa tồn tại
  }

  let targetSessionId: string | undefined;

  // ── Bước 1: Nếu Admin dùng tính năng Reply trên Telegram ──────────────────
  if (msg.reply_to_message) {
    const replyToMsgId = msg.reply_to_message.message_id;

    // 1.1 Tra từ bộ nhớ RAM trước (nhanh và không phụ thuộc schema DB)
    targetSessionId = msgSessionMap.get(replyToMsgId);

    // 1.2 Tra từ cột telegram_message_id trong DB
    if (!targetSessionId) {
      try {
        const { data: original } = await db
          .from("chat_messages")
          .select("session_id")
          .eq("telegram_message_id", replyToMsgId)
          .limit(1)
          .maybeSingle();

        targetSessionId = original?.session_id;
      } catch {
        // Bỏ qua nếu DB chưa có cột telegram_message_id
      }
    }

    // 1.3 Dự phòng: Tìm từ mã `#sid_xxxx` trong nội dung tin nhắn gốc được reply
    if (!targetSessionId) {
      const sourceText = msg.reply_to_message.text || msg.reply_to_message.caption || "";
      const match = sourceText.match(/#sid_([a-f0-9-]+)/i);
      if (match?.[1]) {
        targetSessionId = await resolveSessionCandidate(db, match[1].toLowerCase());
      }
    }
  }

  // ── Bước 2: Nếu trong chính nội dung reply có chứa `#sid_xxxx` ───────────
  if (!targetSessionId) {
    const directMatch = replyText.match(/#sid_([a-f0-9-]+)/i);
    if (directMatch?.[1]) {
      targetSessionId = await resolveSessionCandidate(db, directMatch[1].toLowerCase());
    }
  }

  // ── Bước 3: Admin nhắn trực tiếp không cần Reply (hoặc tin cũ không khớp ID) ─
  if (!targetSessionId) {
    // 3.1 Tìm phiên từ tin nhắn gần nhất của khách trong chat_messages
    const { data: latestUserMsg } = await db
      .from("chat_messages")
      .select("session_id")
      .eq("role", "user")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestUserMsg?.session_id) {
      targetSessionId = latestUserMsg.session_id;
    }

    // 3.2 Nếu có preferredSessionId từ client đang mở polling và chưa tìm được
    if (!targetSessionId && preferredSessionId) {
      const { data: preferred } = await db
        .from("chat_sessions")
        .select("id")
        .eq("id", preferredSessionId)
        .maybeSingle();
      if (preferred?.id) {
        targetSessionId = preferred.id;
      }
    }

    // 3.3 Dự phòng cuối: lấy phiên đang mở mới nhất trong chat_sessions
    if (!targetSessionId) {
      const { data: latestSession } = await db
        .from("chat_sessions")
        .select("id")
        .eq("status", "open")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestSession?.id) {
        targetSessionId = latestSession.id;
      }
    }
  }

  if (!targetSessionId) {
    console.warn("[telegram] Không tìm thấy session phù hợp cho tin nhắn:", replyText);
    return { ok: true, skipped: "no_session_found" };
  }

  // ── Bước 4: Lưu phản hồi của Admin vào Supabase ───────────────────────────
  // Thử insert kèm telegram_message_id; nếu DB chưa chạy migration thêm cột này thì tự động fallback insert không cần cột telegram_message_id.
  let newMsg: { id: string; created_at: string } | null = null;
  let insertErr: { message?: string } | null = null;

  const firstAttempt = await db
    .from("chat_messages")
    .insert({
      session_id: targetSessionId,
      role: "admin",
      text: replyText,
      telegram_message_id: msg.message_id,
    })
    .select("id, created_at")
    .single();

  newMsg = firstAttempt.data;
  insertErr = firstAttempt.error;

  if (insertErr || !newMsg) {
    console.warn(
      "[telegram] Insert kèm telegram_message_id thất bại, tự động fallback insert chuẩn:",
      insertErr?.message
    );
    const fallbackAttempt = await db
      .from("chat_messages")
      .insert({
        session_id: targetSessionId,
        role: "admin",
        text: replyText,
      })
      .select("id, created_at")
      .single();

    newMsg = fallbackAttempt.data;
    insertErr = fallbackAttempt.error;
  }

  if (insertErr || !newMsg) {
    console.error("[telegram] Lỗi lưu tin nhắn admin vào Supabase:", insertErr);
    return { ok: false, skipped: insertErr?.message ?? "insert_failed" };
  }

  // Đánh dấu đã xử lý thành công
  processedMsgIds.add(msg.message_id);
  if (typeof update.update_id === "number") {
    processedUpdateIds.add(update.update_id);
  }
  registerTelegramMessageSession(msg.message_id, targetSessionId);

  console.log(`[telegram] ✅ Đã lưu phản hồi vào session ${targetSessionId}: "${replyText}"`);

  // ── Bước 5: Broadcast Realtime tới client ─────────────────────────────────
  await broadcastToSession(targetSessionId, {
    id: newMsg.id,
    role: "admin",
    text: replyText,
    created_at: newMsg.created_at,
  });

  return { ok: true, sessionId: targetSessionId, messageId: newMsg.id };
}

async function resolveSessionCandidate(
  db: ReturnType<typeof createServerClient>,
  sidCandidate: string
): Promise<string | undefined> {
  if (sidCandidate.length === 36) {
    const { data: session } = await db
      .from("chat_sessions")
      .select("id")
      .eq("id", sidCandidate)
      .maybeSingle();
    if (session?.id) return session.id;
  } else {
    const { data: recentSessions } = await db
      .from("chat_sessions")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(50);
    const matched = recentSessions?.find(s => s.id.toLowerCase().startsWith(sidCandidate));
    if (matched?.id) return matched.id;
  }
  return undefined;
}

// ─── Tự động kéo tin nhắn mới từ Telegram (Không cần chạy script rời) ──────

export async function syncTelegramUpdates(options?: {
  isLocalRequest?: boolean;
  preferredSessionId?: string;
  currentOrigin?: string;
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const now = Date.now();

  // Nếu đang có 1 tiến trình sync chạy thì đợi tiến trình đó hoàn tất
  if (globalForTelegram.__telegramSyncPromise) {
    await globalForTelegram.__telegramSyncPromise;
    return;
  }

  // Nếu Webhook trên production đang hoạt động tốt (và không phải môi trường localhost), không cần gọi getUpdates
  if (
    !options?.isLocalRequest &&
    globalForTelegram.__telegramWebhookActiveUntil &&
    now < globalForTelegram.__telegramWebhookActiveUntil
  ) {
    return;
  }

  // Giới hạn tần suất gọi Telegram API tối đa 1 lần mỗi 1.5 giây trên mỗi instance
  if (
    globalForTelegram.__telegramLastSyncAt &&
    now - globalForTelegram.__telegramLastSyncAt < 1500
  ) {
    return;
  }

  globalForTelegram.__telegramLastSyncAt = now;

  const runSync = async () => {
    try {
      const baseUrl = `https://api.telegram.org/bot${token}`;
      const offset = globalForTelegram.__telegramOffset ?? 0;

      let res = await fetch(
        `${baseUrl}/getUpdates?offset=${offset}&timeout=0&allowed_updates=${encodeURIComponent(
          JSON.stringify(["message", "edited_message", "channel_post"])
        )}`,
        { cache: "no-store" }
      );
      let data = (await res.json()) as {
        ok: boolean;
        error_code?: number;
        description?: string;
        result?: TelegramUpdate[];
      };

      // Trường hợp 409 Conflict: Telegram đang giữ một Webhook URL
      if (!data.ok && data.error_code === 409) {
        const infoRes = await fetch(`${baseUrl}/getWebhookInfo`, { cache: "no-store" });
        const info = (await infoRes.json()) as {
          ok: boolean;
          result?: {
            url?: string;
            pending_update_count?: number;
            last_error_date?: number;
            last_error_message?: string;
          };
        };

        const webhookUrl = info.result?.url || "";
        const hasWebhookError = Boolean(info.result?.last_error_message);
        const hasPendingUpdates = (info.result?.pending_update_count ?? 0) > 0;
        const isDifferentOrigin =
          Boolean(options?.currentOrigin) &&
          Boolean(webhookUrl) &&
          !webhookUrl.startsWith(options!.currentOrigin!);

        // Nếu chạy ở localhost, hoặc webhook trỏ sai domain cũ, hoặc webhook bị lỗi 401/403/500, hoặc có tin nhắn đang kẹt
        // -> Tự động gỡ webhook bị kẹt để kéo tin trực tiếp qua getUpdates
        if (
          options?.isLocalRequest ||
          hasWebhookError ||
          hasPendingUpdates ||
          isDifferentOrigin ||
          !webhookUrl
        ) {
          console.warn(
            `[telegram/sync] Giải phóng Webhook không khớp/lỗi (${
              info.result?.last_error_message || webhookUrl || "local mode"
            }) để đồng bộ trực tiếp qua getUpdates...`
          );
          await fetch(`${baseUrl}/deleteWebhook?drop_pending_updates=false`, {
            cache: "no-store",
          });

          // Gọi lại getUpdates ngay sau khi gỡ webhook
          res = await fetch(`${baseUrl}/getUpdates?offset=${offset}&timeout=0`, {
            cache: "no-store",
          });
          data = await res.json();
        } else {
          // Webhook trên đúng domain hiện tại đang hoạt động tốt, tạm nghỉ polling 30s
          globalForTelegram.__telegramWebhookActiveUntil = Date.now() + 30_000;
          return;
        }
      }

      if (!data.ok || !Array.isArray(data.result) || data.result.length === 0) {
        return;
      }

      let nextOffset = offset;
      for (const update of data.result) {
        if (typeof update.update_id === "number" && update.update_id >= nextOffset) {
          nextOffset = update.update_id + 1;
        }
        await processTelegramUpdate(update, options?.preferredSessionId);
      }

      if (nextOffset > offset) {
        globalForTelegram.__telegramOffset = nextOffset;
        // Bắt buộc await trên Vercel Serverless để request xác nhận offset không bị đóng băng giữa chừng
        await fetch(`${baseUrl}/getUpdates?offset=${nextOffset}&limit=1&timeout=0`, {
          cache: "no-store",
        }).catch(() => {});
      }
    } catch (err) {
      console.error("[telegram/sync] Lỗi đồng bộ tin nhắn từ Telegram:", err);
    }
  };

  globalForTelegram.__telegramSyncPromise = runSync();
  try {
    await globalForTelegram.__telegramSyncPromise;
  } finally {
    globalForTelegram.__telegramSyncPromise = null;
  }
}
