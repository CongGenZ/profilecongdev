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
const chatId = env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

console.log("🔍 Đang kiểm tra cấu hình Telegram...");
console.log("- Token:", token ? `${token.slice(0, 10)}...` : "❌ THIẾU");
console.log("- Chat ID:", chatId || "❌ THIẾU");

if (!token || !chatId) {
  console.error("❌ Vui lòng kiểm tra lại file .env.local!");
  process.exit(1);
}

async function test() {
  // 1. Kiểm tra Bot Token
  console.log("\n1️⃣ Kiểm tra thông tin Bot (getMe)...");
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const meData = await meRes.json();
    if (meData.ok) {
      console.log(`✅ Bot hợp lệ: @${meData.result.username} (${meData.result.first_name})`);
    } else {
      console.error("❌ Token không hợp lệ:", meData);
      return;
    }
  } catch (err) {
    console.error("❌ Không thể kết nối tới Telegram API:", err.message);
    return;
  }

  // 2. Thử gửi tin nhắn tới Chat ID
  console.log(`\n2️⃣ Thử gửi tin nhắn kiểm tra tới Chat ID: ${chatId}...`);
  try {
    const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "🔔 Đây là tin nhắn kiểm tra kết nối từ hệ thống portfolio của bạn!",
      }),
    });
    const sendData = await sendRes.json();
    if (sendData.ok) {
      console.log("🎉 THÀNH CÔNG! Bot đã gửi được tin nhắn về Telegram của bạn!");
      console.log("👉 Hãy mở ứng dụng Telegram để kiểm tra tin nhắn vừa nhận.");
    } else {
      console.error("❌ Gửi tin nhắn thất bại từ Telegram API:");
      console.error("   Mã lỗi:", sendData.error_code);
      console.error("   Chi tiết:", sendData.description);
      console.log("\n💡 GỢI Ý KHẮC PHỤC:");
      if (sendData.description?.includes("chat not found") || sendData.description?.includes("can't initiate conversation")) {
        console.log("👉 Bạn CHƯA bấm /start trong cuộc trò chuyện với bot!");
        console.log("   Hãy mở Telegram, tìm bot của bạn và bấm nút 'START' (/start).");
      } else if (sendData.description?.includes("chat_id is empty") || sendData.description?.includes("invalid")) {
        console.log("👉 TELEGRAM_CHAT_ID không đúng. Hãy kiểm tra lại ID tài khoản của bạn.");
      }
    }
  } catch (err) {
    console.error("❌ Lỗi gửi tin:", err.message);
  }
}

test();
