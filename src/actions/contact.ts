"use server";

import { contactSchema } from "@/lib/validations";

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
      message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
    };
  }

  const { name, email, projectType, message } = parsed.data;

  // In production: send email via Resend / Nodemailer / etc.
  // For now we simulate a network delay and always succeed.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log("Contact form submission:", { name, email, projectType, message });

  return {
    success: true,
    message: `Cảm ơn ${name}! Mình đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng 24 giờ.`,
  };
}
