"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, AlertCircle, Mail, Clock, Send, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SectionHeading } from "@/components/shared/section-heading";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { submitContact } from "@/actions/contact";
import { profile } from "@/data/profile";

const projectTypes = [
  { value: "website", label: "Website / Landing page" },
  { value: "webapp", label: "Web Application" },
  { value: "mobile", label: "Mobile App" },
  { value: "maintenance", label: "Bảo trì / Nâng cấp" },
  { value: "other", label: "Khác" },
];

const contactLinks = [
  {
    icon: Phone,
    label: "Hotline / Zalo",
    value: "0968 261 603",
    href: "tel:0968261603",
  },
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "github.com/nvcong25042003",
    href: profile.github,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/nvcong25042003",
    href: profile.linkedin,
  },
];

export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", projectType: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("loading");
    try {
      const result = await submitContact(values);
      if (result.success) {
        setStatus("success");
        setMessage(result.message);
        form.reset();
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    } catch {
      setStatus("error");
      setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <section
      id="contact"
      className="section-padding border-t"
      style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border-color)" }}
    >
      <div className="container-width">
        <div className="grid md:grid-cols-[2fr_1.1fr] gap-10 md:gap-14 items-start">

          {/* ── Form card ── */}
          <div
            className="rounded-2xl border p-7 md:p-9"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            }}
          >
            <SectionHeading
              label="Contact"
              title="Bạn đang có ý tưởng cần triển khai?"
              description="Hãy chia sẻ ý tưởng của bạn. Mình sẵn sàng trao đổi để tìm ra giải pháp phù hợp."
            />

            {status === "success" ? (
              <div
                className="p-6 rounded-xl border space-y-4"
                style={{ borderColor: "#bbf7d0", backgroundColor: "#f0fdf4" }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle size={22} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-base font-semibold text-green-900 mb-1">Gửi thành công!</p>
                    <p className="text-sm text-green-700 leading-relaxed">{message}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStatus("idle")}
                  className="text-xs font-medium border-green-300 text-green-800 hover:bg-green-100"
                >
                  Gửi yêu cầu khác
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            Họ và tên
                          </FormLabel>
                          <FormControl>
                            <div>
                              <Input
                                placeholder="Nguyen Van A"
                                {...field}
                                className="h-11 text-sm rounded-xl transition-shadow"
                                style={{
                                  borderColor: "var(--border-color)",
                                  backgroundColor: "var(--bg-base)",
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            Email
                          </FormLabel>
                          <FormControl>
                            <div>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                {...field}
                                className="h-11 text-sm rounded-xl transition-shadow"
                                style={{
                                  borderColor: "var(--border-color)",
                                  backgroundColor: "var(--bg-base)",
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          Loại dự án
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <div>
                              <SelectTrigger
                                className="h-11 text-sm rounded-xl"
                                style={{
                                  borderColor: "var(--border-color)",
                                  backgroundColor: "var(--bg-base)",
                                }}
                              >
                                <SelectValue placeholder="Chọn loại dự án..." />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          Mô tả yêu cầu
                        </FormLabel>
                        <FormControl>
                          <div>
                            <Textarea
                              placeholder="Mô tả ngắn về dự án, tính năng cần có, timeline và ngân sách dự kiến..."
                              rows={5}
                              {...field}
                              className="text-sm resize-none rounded-xl transition-shadow"
                              style={{
                                borderColor: "var(--border-color)",
                                backgroundColor: "var(--bg-base)",
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {status === "error" && (
                    <div
                      className="flex items-center gap-2.5 p-3.5 rounded-xl border text-sm"
                      style={{ borderColor: "#fca5a5", backgroundColor: "#fef2f2", color: "#dc2626" }}
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      {message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-11 text-sm font-semibold rounded-xl gap-2 mt-1"
                    style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Gửi yêu cầu
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="md:pt-4 space-y-6">
            {/* Contact links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>
                Liên hệ trực tiếp
              </p>
              <div className="space-y-2">
                {contactLinks.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl border transition-all group"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-color)";
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#EEF4FA";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-surface)";
                    }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--bg-base)", color: "var(--accent-color)" }}
                    >
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-secondary)" }}>
                        {label}
                      </p>
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Response time card */}
            <div
              className="p-4 rounded-xl border-l-[3px] border"
              style={{
                borderLeftColor: "var(--accent-color)",
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Clock size={13} style={{ color: "var(--accent-color)" }} />
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  Thời gian phản hồi
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Thường trong vòng <span className="font-medium" style={{ color: "var(--text-primary)" }}>24 giờ</span> trong ngày làm việc.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
