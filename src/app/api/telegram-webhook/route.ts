import { NextRequest, NextResponse } from "next/server";
import {
  processTelegramUpdate,
  syncTelegramUpdates,
  type TelegramUpdate,
} from "@/lib/telegram";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ─── POST /api/telegram-webhook ────────────────────────────────────────────
// Telegram gọi endpoint này mỗi khi có tin nhắn mới vào bot.

export async function POST(req: NextRequest) {
  // Xác thực secret token (bỏ qua nếu vẫn đang để giá trị mẫu từ .env.example hoặc webhook đăng ký không kèm secret)
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (webhookSecret && webhookSecret !== "your-random-secret-here") {
    const incomingToken = req.headers.get("x-telegram-bot-api-secret-token")?.trim();
    if (incomingToken && incomingToken !== webhookSecret) {
      console.warn("[telegram-webhook] Secret token không khớp với TELEGRAM_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const update: TelegramUpdate = await req.json();
    const result = await processTelegramUpdate(update);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[telegram-webhook]", err);
    // Luôn trả 200 để Telegram không retry liên tục gây nghẽn hàng đợi
    return NextResponse.json({ ok: true });
  }
}

// ─── GET /api/telegram-webhook ─────────────────────────────────────────────
// Mở trực tiếp trên trình duyệt (VD: https://ten-mien.vercel.app/api/telegram-webhook)
// để kiểm tra trạng thái kết nối Telegram + Supabase hoặc tự động cài đặt Webhook (?setup=1)

export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  const setupMode = req.nextUrl.searchParams.get("setup");

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Thiếu biến môi trường TELEGRAM_BOT_TOKEN trên Vercel" },
      { status: 500 }
    );
  }

  const baseUrl = `https://api.telegram.org/bot${token}`;
  let setupResult: unknown = null;

  // Nếu truyền ?setup=1 -> tự động đăng ký Webhook trỏ về domain Vercel hiện tại
  if (setupMode === "1") {
    const webhookUrl = `${req.nextUrl.origin}/api/telegram-webhook`;
    const params = new URLSearchParams({ url: webhookUrl });
    if (webhookSecret && webhookSecret !== "your-random-secret-here") {
      params.append("secret_token", webhookSecret);
    }
    const setRes = await fetch(`${baseUrl}/setWebhook?${params.toString()}`, {
      cache: "no-store",
    });
    setupResult = await setRes.json();
  } else if (setupMode === "polling") {
    // Nếu truyền ?setup=polling -> xóa webhook để dùng chế độ auto-sync getUpdates
    const delRes = await fetch(`${baseUrl}/deleteWebhook?drop_pending_updates=false`, {
      cache: "no-store",
    });
    setupResult = await delRes.json();
    await syncTelegramUpdates({ isLocalRequest: true });
  }

  // Kiểm tra trạng thái Webhook trên Telegram
  const infoRes = await fetch(`${baseUrl}/getWebhookInfo`, { cache: "no-store" });
  const webhookInfo = await infoRes.json();

  // Kiểm tra cột telegram_message_id trong bảng chat_messages trên Supabase
  let dbStatus = "ok";
  let hasTelegramMsgIdColumn = true;
  try {
    const db = createServerClient();
    const { error } = await db
      .from("chat_messages")
      .select("id, telegram_message_id")
      .limit(1);
    if (error) {
      hasTelegramMsgIdColumn = false;
      dbStatus = `Thiếu cột telegram_message_id hoặc lỗi schema (${error.message}) — Hệ thống đã tự bật chế độ fallback vẫn lưu tin nhắn bình thường.`;
    }
  } catch (err) {
    dbStatus = `Lỗi kết nối Supabase: ${String(err)}`;
  }

  return NextResponse.json({
    ok: true,
    environment: {
      origin: req.nextUrl.origin,
      hasBotToken: Boolean(token),
      hasChatId: Boolean(chatId),
      hasCustomWebhookSecret: Boolean(
        webhookSecret && webhookSecret !== "your-random-secret-here"
      ),
    },
    database: {
      status: dbStatus,
      hasTelegramMsgIdColumn,
    },
    setupResult,
    telegramWebhookInfo: webhookInfo,
    tips: {
      autoSetupWebhookUrl: `${req.nextUrl.origin}/api/telegram-webhook?setup=1`,
      switchToAutoPollingUrl: `${req.nextUrl.origin}/api/telegram-webhook?setup=polling`,
    },
  });
}
