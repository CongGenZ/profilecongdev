"use server";

import { contactSchema } from "@/lib/validations";
import { sendContactEmail, getProjectLabel } from "@/lib/mail";
import { createServerClient } from "@/lib/supabase";

export interface ContactResult {
  success: boolean;
  message: string;
}

export async function submitContact(
  data: unknown
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường thông tin.",
    };
  }

  const { name, email, projectType, message } = parsed.data;

  let emailSent = false;
  let dbSaved = false;
  let telegramSent = false;

  // 1. Thử gửi email qua Nodemailer (nếu đã cấu hình mật khẩu ứng dụng SMTP_PASS)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await sendContactEmail({ name, email, projectType, message });
      emailSent = true;
      console.log("[contact] Gửi email qua Nodemailer thành công!");
    } catch (mailErr) {
      console.error("[contact] Lỗi gửi email qua Nodemailer:", mailErr);
    }
  } else {
    console.warn(
      "[contact] Chưa cấu hình SMTP_PASS trong .env. Bỏ qua gửi email (chuyển sang lưu DB & Telegram)."
    );
  }

  // 2. Tự động lưu vào database Supabase (nếu có cấu hình)
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      const supabase = createServerClient();
      const { error: dbError } = await supabase.from("contact_submissions").insert({
        name,
        email,
        project_type: projectType,
        message,
        status: "new",
      });

      if (!dbError) {
        dbSaved = true;
        console.log("[contact] Đã lưu vào Supabase contact_submissions!");
      } else {
        console.warn("[contact] Lỗi lưu Supabase:", dbError);
      }
    }
  } catch (dbErr) {
    console.warn("[contact] Không thể lưu vào Supabase:", dbErr);
  }

  // 3. Gửi thông báo tức thì qua Telegram (nếu có bot token và chat ID)
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const projectLabel = getProjectLabel(projectType);
      const teleText =
        `📬 <b>Có liên hệ mới từ Portfolio</b>\n\n` +
        `👤 <b>Họ tên:</b> ${escapeHtml(name)}\n` +
        `📧 <b>Email:</b> ${escapeHtml(email)}\n` +
        `📁 <b>Loại dự án:</b> ${escapeHtml(projectLabel)}\n` +
        `💬 <b>Nội dung:</b>\n${escapeHtml(message)}`;

      const teleRes = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: teleText,
            parse_mode: "HTML",
          }),
        }
      );

      if (teleRes.ok) {
        telegramSent = true;
        console.log("[contact] Đã gửi thông báo Telegram thành công!");
      } else {
        const teleErrText = await teleRes.text();
        console.warn("[contact] Lỗi phản hồi Telegram:", teleErrText);
      }
    }
  } catch (teleErr) {
    console.warn("[contact] Không thể gửi thông báo Telegram:", teleErr);
  }

  // Nếu ít nhất 1 kênh thành công (Email, Telegram hoặc Database) -> Thông báo thành công cho người dùng
  if (emailSent || telegramSent || dbSaved) {
    return {
      success: true,
      message: `Cảm ơn ${name}! Yêu cầu của bạn đã được tiếp nhận thành công. Mình sẽ phản hồi qua email trong vòng 24 giờ.`,
    };
  }

  // Nếu cả 3 kênh đều không gửi được
  return {
    success: false,
    message:
      "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại hoặc gửi trực tiếp vào email cá nhân của mình.",
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
