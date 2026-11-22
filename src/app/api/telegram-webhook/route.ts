import { NextRequest, NextResponse } from "next/server";
import { processTelegramUpdate, type TelegramUpdate } from "@/lib/telegram";

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
