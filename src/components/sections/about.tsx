"use client";

import { useState } from "react";
import { Briefcase, CheckCircle2, FileText, Download, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { profile as rawProfile } from "@/data/profile";
import { experiences as rawExperiences } from "@/data/experience";
import { useI18n } from "@/i18n/provider";
import { techStack } from "@/data/tech-stack";

export function About() {
  const [cvOpen, setCvOpen] = useState(false);
  const { t, tr } = useI18n();
  const profile = tr(rawProfile);
  const experiences = tr(rawExperiences);

  const paragraphs = profile.bio
    .trim()
    .split("\n\n")
    .filter(Boolean);

  return (
    <section
      id="about"
      className="section-padding border-t"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="container-width">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">
          {/* Left label & Quick Resume Card */}
          <div className="space-y-6">
            <SectionHeading
              label="About & Experience"
              title={t("Một chút về mình & lộ trình làm việc")}
            />

            <div
              className="p-5 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--bg-base)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--accent-color)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <FileText size={18} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t("Hồ sơ năng lực (CV)")}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t("Tóm tắt kỹ năng, kinh nghiệm & dự án")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setCvOpen(true)}
                  className="flex-1 text-xs font-medium h-9 gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    color: "#ffffff",
                  }}
                >
                  <FileText size={14} />
                  {t("Xem Hồ sơ / CV")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    document
                      .getElementById("estimator")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 text-xs font-medium h-9 gap-1.5 cursor-pointer"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  <Sparkles size={14} />
                  {t("Báo giá nhanh")}
                </Button>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div>
            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {p.trim()}
                </p>
              ))}
            </div>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                { label: t("Kinh nghiệm thực chiến"), value: t("2+ năm") },
                { label: t("Dự án đã hoàn thiện"), value: t("10+ dự án") },
                { label: t("Thời gian phản hồi"), value: t("< 2 giờ") },
                { label: t("Hình thức hợp tác"), value: "Freelance / Remote" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border rounded-xl p-4"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-base)",
                  }}
                >
                  <p
                    className="text-lg md:text-xl font-bold"
                    style={{ color: "var(--accent-color)" }}
                  >
                    {item.value}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Experience Timeline */}
            <div
              className="mt-12 pt-10 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Briefcase size={18} style={{ color: "var(--accent-color)" }} />
                <h3
                  className="text-base font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("Lộ trình kinh nghiệm & Dự án thực tế")}
                </h3>
              </div>

              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div
                    key={exp.period + exp.role}
                    className="relative pl-6 border-l-2"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <span
                      className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2"
                      style={{
                        borderColor: "var(--accent-color)",
                        backgroundColor: "var(--bg-surface)",
                      }}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div>
                        <h4
                          className="text-base font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {exp.role}
                        </h4>
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--accent-color)" }}
                        >
                          {exp.company} · {exp.type}
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full border"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {exp.period}
                      </span>
                    </div>

                    <p
                      className="text-sm leading-relaxed mb-3"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {exp.description}
                    </p>

                    <ul className="space-y-1.5 mb-3">
                      {exp.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2 text-xs md:text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <CheckCircle2
                            size={14}
                            className="shrink-0 mt-0.5"
                            style={{ color: "var(--accent-color)" }}
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] px-2 py-0.5 rounded border font-medium"
                          style={{
                            backgroundColor: "var(--bg-base)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Resume / CV Modal */}
      <Dialog open={cvOpen} onOpenChange={setCvOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {profile.name} ({profile.displayName}) — {profile.title}
            </DialogTitle>
            <DialogDescription>
              {profile.location} · {profile.email} · {profile.phone}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2 text-sm">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: "var(--bg-base)",
                borderColor: "var(--border-color)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--accent-color)" }}
              >
                {t("Tóm tắt chuyên môn")}
              </p>
              <p
                className="text-xs md:text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("Full-stack Web Developer chuyên xây dựng ứng dụng web hiện đại với Next.js, React, TypeScript kết hợp Backend .NET Microservices, Node.js và PostgreSQL/Supabase. Chú trọng hiệu năng, kiến trúc sạch và giải quyết bài toán thực tế của doanh nghiệp.")}
              </p>
            </div>

            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2.5"
                style={{ color: "var(--accent-color)" }}
              >
                {t("Kinh nghiệm làm việc")}
              </p>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.period}
                    className="p-3.5 rounded-xl border"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {exp.role} — {exp.company}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {exp.period}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {exp.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--accent-color)" }}
              >
                {t("Kỹ năng công nghệ")}
              </p>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {techStack.map((cat) => (
                  <div
                    key={cat.category}
                    className="p-3 rounded-lg border"
                    style={{
                      backgroundColor: "var(--bg-base)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {cat.category}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {cat.items.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs gap-1.5 cursor-pointer"
              >
                <Download size={14} />
                {t("In / Lưu PDF")}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setCvOpen(false);
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs cursor-pointer"
                style={{
                  backgroundColor: "var(--accent-color)",
                  color: "#ffffff",
                }}
              >
                {t("Liên hệ hợp tác")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
