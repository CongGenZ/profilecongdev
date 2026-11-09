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

const token = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const secret = env.TELEGRAM_WEBHOOK_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET || "";

if (!token) {
  console.error("❌ Không tìm thấy TELEGRAM_BOT_TOKEN trong .env.local");
  process.exit(1);
}

async function start() {
  console.log("=====================================================");
  console.log("🚀 TELEGRAM LOCAL BRIDGE (KHÔNG CẦN NGROK / TUNNEL)");
  console.log("=====================================================");

  // 1. Gỡ bỏ Webhook cũ để chuyển sang Long Polling
  console.log("⏳ Đang giải phóng Webhook để chuyển sang chế độ Local...");
  try {
    await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);
    console.log("✅ Đã sẵn sàng!");
  } catch (err) {
    console.error("Lỗi gỡ webhook:", err.message);
  }

  console.log("\n👂 Đang lắng nghe tin nhắn từ Telegram và chuyển tiếp tới http://localhost:3000/api/telegram-webhook");
  console.log("👉 Bạn có thể mở web chat và nhắn tin trên Telegram để kiểm tra ngay!\n");

  let offset = 0;

  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=20`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          const text = update.message?.text || update.message?.caption || "(Media)";
          console.log(`\n📩 [Telegram] Nhận được tin nhắn: "${text}"`);

          // Chuyển tiếp tới endpoint local
          try {
            const webhookRes = await fetch("http://localhost:3000/api/telegram-webhook", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-telegram-bot-api-secret-token": secret,
              },
              body: JSON.stringify(update),
            });
            const resData = await webhookRes.json();
            console.log("   ➡️ Đã chuyển vào http://localhost:3000/api/telegram-webhook thành công!", resData);
          } catch (postErr) {
            console.error("   ❌ Lỗi gửi vào localhost:3000 (Hãy chắc chắn web/Docker đang chạy trên cổng 3000):", postErr.message);
          }
        }
      }
    } catch (err) {
      console.error("Lỗi kết nối Telegram API:", err.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

start();
