/**
 * Script hỗ trợ kiểm tra và đăng ký Telegram Webhook
 * Cách dùng:
 * 1. Kiểm tra trạng thái hiện tại:
 *    node scripts/setup-telegram-webhook.mjs
 * 
 * 2. Đăng ký Webhook mới:
 *    node scripts/setup-telegram-webhook.mjs https://your-domain-or-ngrok.app
 * 
 * 3. Xóa Webhook (để dùng lại polling nếu cần):
 *    node scripts/setup-telegram-webhook.mjs delete
 */

import fs from "fs";
import path from "path";

// Đọc .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
let env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0) {
      env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const botToken = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const secretToken = env.TELEGRAM_WEBHOOK_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET || "";

if (!botToken) {
  console.error("❌ Không tìm thấy TELEGRAM_BOT_TOKEN trong .env.local");
  process.exit(1);
}

const targetUrlArg = process.argv[2];

async function main() {
  const baseUrl = `https://api.telegram.org/bot${botToken}`;

  if (targetUrlArg === "delete") {
    console.log("⏳ Đang gỡ bỏ Telegram Webhook...");
    const res = await fetch(`${baseUrl}/deleteWebhook`);
    const data = await res.json();
    console.log("Kết quả:", data);
    return;
  }

  if (targetUrlArg) {
    let webhookUrl = targetUrlArg.trim();
    if (!webhookUrl.startsWith("http")) {
      webhookUrl = `https://${webhookUrl}`;
    }
    if (!webhookUrl.endsWith("/api/telegram-webhook")) {
      webhookUrl = `${webhookUrl.replace(/\/$/, "")}/api/telegram-webhook`;
    }

    console.log(`⏳ Đang thiết lập Webhook trỏ về: ${webhookUrl}`);
    const params = new URLSearchParams({
      url: webhookUrl,
    });
    if (secretToken) {
      params.append("secret_token", secretToken);
    }

    const res = await fetch(`${baseUrl}/setWebhook?${params.toString()}`);
    const data = await res.json();
    if (data.ok) {
      console.log("✅ Đăng ký Webhook thành công!");
    } else {
      console.error("❌ Thất bại:", data);
    }
  }

  // Luôn in thông tin trạng thái webhook hiện tại
  console.log("\n📊 Trạng thái Webhook hiện tại trên Telegram:");
  const infoRes = await fetch(`${baseUrl}/getWebhookInfo`);
  const info = await infoRes.json();
  console.log(JSON.stringify(info, null, 2));

  if (!targetUrlArg && !info.result?.url) {
    console.log("\n💡 Gợi ý: Bạn chưa cài đặt Webhook URL.");
    console.log("Nếu chạy local (ngrok/tunnel):");
    console.log("  node scripts/setup-telegram-webhook.mjs https://xxxx.ngrok-free.app");
    console.log("Nếu đã deploy lên Vercel/VPS:");
    console.log("  node scripts/setup-telegram-webhook.mjs https://yourdomain.com");
  }
}

main().catch(console.error);
