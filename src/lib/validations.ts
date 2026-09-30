import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên quá dài"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .max(200, "Email quá dài"),
  projectType: z
    .string()
    .min(1, "Vui lòng chọn loại dự án"),
  message: z
    .string()
    .min(20, "Mô tả yêu cầu phải có ít nhất 20 ký tự")
    .max(2000, "Mô tả quá dài"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
