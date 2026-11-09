import nodemailer from "nodemailer";

export interface ContactMailPayload {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

const projectTypeLabels: Record<string, string> = {
  website: "Website / Landing page",
  webapp: "Web Application",
  mobile: "Mobile App",
  maintenance: "Bảo trì / Nâng cấp",
  other: "Khác",
};

export function getProjectLabel(type: string): string {
  return projectTypeLabels[type] || type;
}

export function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : undefined;

  if (!user || !pass) {
    throw new Error(
      "Chưa cấu hình tài khoản gửi mail (SMTP_USER hoặc SMTP_PASS) trong file môi trường."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true nếu dùng port 465 (SSL), false nếu dùng 587 (TLS)
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Gửi email thông báo liên hệ mới tới Admin (bạn)
 * và tùy chọn gửi email xác nhận cảm ơn tới khách hàng.
 */
export async function sendContactEmail(payload: ContactMailPayload) {
  const transporter = getTransporter();
  const { name, email, projectType, message } = payload;
  const projectLabel = getProjectLabel(projectType);

  const adminEmail =
    process.env.CONTACT_TO_EMAIL ||
    process.env.SMTP_USER ||
    "nvcong25042003@gmail.com";

  const submittedAt = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "full",
    timeStyle: "short",
  });

  // 1. Template email gửi về cho Admin (bạn)
  const adminHtml = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Liên hệ mới từ Portfolio</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #1f2937; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 32px 28px; }
        .badge { display: inline-block; background: rgba(59, 130, 246, 0.2); color: #60a5fa; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid rgba(96, 165, 250, 0.3); }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; }
        .content { padding: 28px; }
        .field { margin-bottom: 20px; }
        .field-label { font-size: 12px; text-transform: uppercase; font-weight: 600; color: #6b7280; margin-bottom: 6px; letter-spacing: 0.03em; }
        .field-value { font-size: 15px; color: #111827; font-weight: 500; }
        .message-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap; word-break: break-word; }
        .footer { padding: 20px 28px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
        .reply-btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 20px; border-radius: 8px; margin-top: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">Portfolio Notification</div>
          <h1>📬 Bạn có liên hệ mới!</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Họ và tên khách hàng</div>
            <div class="field-value">${escapeHtml(name)}</div>
          </div>
          <div class="field">
            <div class="field-label">Địa chỉ Email</div>
            <div class="field-value">
              <a href="mailto:${escapeHtml(email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(email)}</a>
            </div>
          </div>
          <div class="field">
            <div class="field-label">Loại dự án quan tâm</div>
            <div class="field-value"><strong style="color: #1e40af;">${escapeHtml(projectLabel)}</strong></div>
          </div>
          <div class="field">
            <div class="field-label">Nội dung yêu cầu</div>
            <div class="message-box">${escapeHtml(message)}</div>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a class="reply-btn" href="mailto:${escapeHtml(email)}?subject=Re:%20Yêu%20cầu%20tư%20vấn%20dự%20án%20-%20Cong%20Dev">
              Trả lời qua email ngay
            </a>
          </div>
        </div>
        <div class="footer">
          Được gửi tự động từ profilecongdev • ${submittedAt}
        </div>
      </div>
    </body>
    </html>
  `;

  // 2. Gửi email tới Admin
  const adminMailOptions = {
    from: `"Cong Dev Portfolio" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    replyTo: email,
    subject: `[Portfolio Liên Hệ] ${name} - ${projectLabel}`,
    text: `Họ và tên: ${name}\nEmail: ${email}\nLoại dự án: ${projectLabel}\nThời gian: ${submittedAt}\n\nNội dung:\n${message}`,
    html: adminHtml,
  };

  const adminResult = await transporter.sendMail(adminMailOptions);

  // 3. Tự động gửi email cảm ơn / xác nhận tới khách hàng (Auto-reply)
  try {
    const customerHtml = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #1f2937; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
          .header { background: #0f172a; color: #ffffff; padding: 28px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; }
          .content { padding: 28px; font-size: 15px; line-height: 1.6; color: #374151; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0; font-size: 14px; }
          .footer { padding: 20px 28px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cảm ơn bạn đã liên hệ!</h1>
          </div>
          <div class="content">
            <p>Chào <strong>${escapeHtml(name)}</strong>,</p>
            <p>Mình là <strong>Công (Cong Dev)</strong>. Mình đã nhận được thông tin dự án của bạn từ website và sẽ liên hệ lại qua email này trong vòng <strong>24 giờ</strong>.</p>
            <div class="box">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f172a;">Thông tin bạn đã gửi:</p>
              <p style="margin: 4px 0;">• <strong>Loại dự án:</strong> ${escapeHtml(projectLabel)}</p>
              <p style="margin: 4px 0;">• <strong>Nội dung:</strong></p>
              <p style="margin: 4px 0; color: #475569; font-style: italic;">"${escapeHtml(message)}"</p>
            </div>
            <p>Nếu cần trao đổi khẩn cấp, bạn có thể gửi tin nhắn trực tiếp qua:</p>
            <p>• Email: <a href="mailto:${adminEmail}" style="color: #2563eb;">${adminEmail}</a></p>
            <br>
            <p style="margin-bottom: 0;">Trân trọng,</p>
            <p style="margin-top: 4px; font-weight: 600; color: #0f172a;">Nguyễn Văn Công (Cong Dev)</p>
          </div>
          <div class="footer">
            Đây là email tự động xác nhận từ website cá nhân của Cong Dev.
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Nguyen Van Cong (Cong Dev)" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[Cong Dev] Đã nhận được yêu cầu của bạn (${projectLabel})`,
      html: customerHtml,
      text: `Chào ${name},\n\nMình đã nhận được yêu cầu tư vấn dự án "${projectLabel}" của bạn và sẽ phản hồi trong vòng 24 giờ.\n\nTrân trọng,\nNguyễn Văn Công (Cong Dev)`,
    });
  } catch (err) {
    // Không làm gián đoạn nếu việc gửi thư xác nhận cho khách gặp lỗi
    console.warn("Không thể gửi thư xác nhận tự động tới khách hàng:", err);
  }

  return adminResult;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
