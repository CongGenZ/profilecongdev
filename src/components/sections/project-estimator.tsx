"use client";

import { useState, useMemo } from "react";
import { Calculator, Clock, Sparkles, Check, ArrowRight, Layers } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

interface BaseTypeOption {
  id: string;
  contactType: string;
  label: string;
  desc: string;
  minMillion: number;
  maxMillion: number;
  minWeeks: number;
  maxWeeks: number;
  stack: string[];
}

interface AddonFeature {
  id: string;
  label: string;
  minMillion: number;
  maxMillion: number;
  weeks: number;
}

const BASE_TYPES: BaseTypeOption[] = [
  {
    id: "landing",
    contactType: "website",
    label: "Landing Page / Website Doanh nghiệp",
    desc: "Chuẩn SEO, tốc độ cao, giao diện hiện đại & CMS quản lý nội dung",
    minMillion: 5,
    maxMillion: 9,
    minWeeks: 1,
    maxWeeks: 2,
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
  },
  {
    id: "ecommerce",
    contactType: "webapp",
    label: "E-Commerce / Website Bán hàng",
    desc: "Giỏ hàng, quản lý sản phẩm, đơn hàng, tồn kho & báo cáo doanh thu",
    minMillion: 12,
    maxMillion: 20,
    minWeeks: 3,
    maxWeeks: 5,
    stack: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
  },
  {
    id: "webapp",
    contactType: "webapp",
    label: "Web Application / Hệ thống Quản lý (SaaS/CRM/POS)",
    desc: "Ứng dụng nghiệp vụ chuyên sâu, phân quyền, xử lý dữ liệu thời gian thực",
    minMillion: 15,
    maxMillion: 28,
    minWeeks: 4,
    maxWeeks: 7,
    stack: ["Next.js / React", "Node.js / .NET", "PostgreSQL", "Docker"],
  },
  {
    id: "maintenance",
    contactType: "maintenance",
    label: "Bảo trì, Tối ưu & Nâng cấp tính năng",
    desc: "Sửa lỗi, tối ưu tốc độ, nâng cấp giao diện hoặc thêm module mới",
    minMillion: 3,
    maxMillion: 7,
    minWeeks: 1,
    maxWeeks: 2,
    stack: ["React / Next.js", ".NET / Node.js", "SQL Optimization"],
  },
];

const ADDON_FEATURES: AddonFeature[] = [
  {
    id: "payment",
    label: "Tích hợp Thanh toán Online (VNPay / VietQR / Stripe)",
    minMillion: 2,
    maxMillion: 4,
    weeks: 1,
  },
  {
    id: "admin",
    label: "Dashboard Quản trị & Biểu đồ Báo cáo nâng cao",
    minMillion: 3,
    maxMillion: 5,
    weeks: 1,
  },
  {
    id: "realtime",
    label: "Tính năng Realtime (Live Chat / Thông báo / Socket / Telegram Bot)",
    minMillion: 2,
    maxMillion: 4,
    weeks: 1,
  },
  {
    id: "i18n",
    label: "Đa ngôn ngữ (Tiếng Việt / Tiếng Anh / Quốc tế)",
    minMillion: 1.5,
    maxMillion: 3,
    weeks: 0.5,
  },
  {
    id: "ai",
    label: "Tích hợp AI Assistant / Chatbot tư vấn tự động",
    minMillion: 3,
    maxMillion: 6,
    weeks: 1,
  },
  {
    id: "auth",
    label: "Phân quyền đa cấp (RBAC) & Đăng nhập OAuth (Google/Facebook)",
    minMillion: 1.5,
    maxMillion: 3,
    weeks: 0.5,
  },
];

export function ProjectEstimator() {
  const [selectedBaseId, setSelectedBaseId] = useState<string>("webapp");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["admin", "realtime"]);
  const [urgent, setUrgent] = useState<boolean>(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const estimation = useMemo(() => {
    const base = BASE_TYPES.find((b) => b.id === selectedBaseId) ?? BASE_TYPES[0];
    const addons = ADDON_FEATURES.filter((a) => selectedAddons.includes(a.id));

    let minCost = base.minMillion + addons.reduce((acc, a) => acc + a.minMillion, 0);
    let maxCost = base.maxMillion + addons.reduce((acc, a) => acc + a.maxMillion, 0);
    let minW = base.minWeeks + addons.reduce((acc, a) => acc + a.weeks * 0.6, 0);
    let maxW = base.maxWeeks + addons.reduce((acc, a) => acc + a.weeks, 0);

    if (urgent) {
      minCost = Math.round(minCost * 1.2);
      maxCost = Math.round(maxCost * 1.2);
      minW = Math.max(1, Math.round(minW * 0.7));
      maxW = Math.max(1.5, Math.round(maxW * 0.75));
    } else {
      minCost = Math.round(minCost);
      maxCost = Math.round(maxCost);
      minW = Math.round(minW);
      maxW = Math.ceil(maxW);
    }

    return {
      base,
      addons,
      minCost,
      maxCost,
      minWeeks: minW,
      maxWeeks: maxW,
    };
  }, [selectedBaseId, selectedAddons, urgent]);

  const handleApplyToContact = () => {
    const addonNames =
      estimation.addons.length > 0
        ? estimation.addons.map((a) => `- ${a.label}`).join("\n")
        : "- Các tính năng cơ bản theo gói";

    const summaryText =
      `Mình quan tâm triển khai gói: ${estimation.base.label}\n` +
      `Tính năng đã chọn:\n${addonNames}\n` +
      `Tiến độ: ${urgent ? "Ưu tiên làm gấp" : "Tiêu chuẩn"} (Ước tính ~${estimation.minWeeks}-${estimation.maxWeeks} tuần | Ngân sách tham khảo: ${estimation.minCost} - ${estimation.maxCost} triệu VNĐ).\n\n` +
      `Mô tả thêm về bài toán của mình: `;

    window.dispatchEvent(
      new CustomEvent("prefill-contact-form", {
        detail: {
          projectType: estimation.base.contactType,
          message: summaryText,
        },
      })
    );

    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="estimator"
      className="section-padding border-t"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="container-width">
        <SectionHeading
          label="Cost & Timeline Estimator"
          title="Ước tính nhanh chi phí & thời gian dự án"
          description="Chọn loại sản phẩm và các tính năng bạn cần để xem ngay khoảng ngân sách, lộ trình tham khảo và kiến trúc đề xuất."
        />

        <div className="grid lg:grid-cols-[1.65fr_1fr] gap-8 items-start">
          {/* Left: Selectors */}
          <div className="space-y-8">
            {/* Step 1: Project Type */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--accent-color)" }}
              >
                1. Chọn loại sản phẩm cần xây dựng
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {BASE_TYPES.map((type) => {
                  const active = selectedBaseId === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedBaseId(type.id)}
                      className="text-left p-4 rounded-xl border transition-all cursor-pointer"
                      style={
                        active
                          ? {
                              borderColor: "var(--accent-color)",
                              backgroundColor: "var(--bg-base)",
                              boxShadow: "0 0 0 1px var(--accent-color)",
                            }
                          : {
                              borderColor: "var(--border-color)",
                              backgroundColor: "var(--bg-base)",
                            }
                      }
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className="text-sm font-semibold leading-snug"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {type.label}
                        </p>
                        <span
                          className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                          style={
                            active
                              ? {
                                  backgroundColor: "var(--accent-color)",
                                  borderColor: "var(--accent-color)",
                                  color: "#fff",
                                }
                              : { borderColor: "var(--border-color)" }
                          }
                        >
                          {active && <Check size={10} />}
                        </span>
                      </div>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {type.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Add-on Features */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--accent-color)" }}
              >
                2. Chọn các tính năng nâng cao đi kèm
              </p>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {ADDON_FEATURES.map((addon) => {
                  const checked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className="flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer"
                      style={
                        checked
                          ? {
                              borderColor: "var(--accent-color)",
                              backgroundColor: "var(--bg-base)",
                            }
                          : {
                              borderColor: "var(--border-color)",
                              backgroundColor: "var(--bg-base)",
                            }
                      }
                    >
                      <span
                        className="w-4 h-4 rounded flex items-center justify-center border shrink-0"
                        style={
                          checked
                            ? {
                                backgroundColor: "var(--accent-color)",
                                borderColor: "var(--accent-color)",
                                color: "#fff",
                              }
                            : { borderColor: "var(--border-color)" }
                        }
                      >
                        {checked && <Check size={11} />}
                      </span>
                      <span
                        className="text-xs font-medium leading-snug"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {addon.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Timeline Priority */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border" style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border-color)" }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Ưu tiên rút ngắn tiến độ (Fast-track)
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Tăng cường thời gian làm việc để bàn giao bản MVP sớm hơn ~25–30%
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUrgent((v) => !v)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer"
                style={
                  urgent
                    ? {
                        backgroundColor: "var(--accent-color)",
                        borderColor: "var(--accent-color)",
                        color: "#ffffff",
                      }
                    : {
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-secondary)",
                      }
                }
              >
                {urgent ? "⚡ Đang bật ưu tiên gấp" : "Tiến độ tiêu chuẩn"}
              </button>
            </div>
          </div>

          {/* Right: Summary Sticky Box */}
          <div
            className="rounded-2xl border p-6 space-y-6 lg:sticky lg:top-24"
            style={{
              backgroundColor: "var(--bg-base)",
              borderColor: "var(--border-color)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex items-center gap-2">
                <Calculator size={18} style={{ color: "var(--accent-color)" }} />
                <h3
                  className="text-base font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Kết quả ước tính sơ bộ
                </h3>
              </div>
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: "var(--label-bg)",
                  color: "var(--label-color)",
                  borderColor: "rgba(180,83,9,0.2)",
                }}
              >
                Tham khảo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-color)",
                }}
              >
                <p
                  className="text-xs flex items-center gap-1 mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Sparkles size={12} style={{ color: "var(--accent-color)" }} />
                  Ngân sách dự kiến
                </p>
                <p
                  className="text-lg md:text-xl font-bold"
                  style={{ color: "var(--accent-color)" }}
                >
                  {estimation.minCost} – {estimation.maxCost} tr
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  VNĐ (Trọn gói, không phí ẩn)
                </p>
              </div>

              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-color)",
                }}
              >
                <p
                  className="text-xs flex items-center gap-1 mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Clock size={12} style={{ color: "var(--accent-color)" }} />
                  Thời gian triển khai
                </p>
                <p
                  className="text-lg md:text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {estimation.minWeeks} – {estimation.maxWeeks} tuần
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  Bao gồm kiểm thử & deploy
                </p>
              </div>
            </div>

            {/* Recommended Tech Stack */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                <Layers size={13} style={{ color: "var(--accent-color)" }} />
                Công nghệ đề xuất
              </p>
              <div className="flex flex-wrap gap-1.5">
                {estimation.base.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 rounded-md border font-medium"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              * Chi phí thực tế có thể linh hoạt điều chỉnh tùy theo mức độ phức tạp của từng màn hình và yêu cầu tích hợp cụ thể.
            </p>

            <Button
              type="button"
              onClick={handleApplyToContact}
              className="w-full h-11 text-sm font-semibold rounded-xl gap-2 cursor-pointer"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "#ffffff",
              }}
            >
              Nhận tư vấn với cấu hình này
              <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

