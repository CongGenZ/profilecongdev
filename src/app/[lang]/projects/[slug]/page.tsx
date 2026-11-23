import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Layers, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { ChatWidget } from "@/components/shared/chat-widget";
import { ImageLightbox } from "@/components/shared/image-lightbox";
import { ProjectCard } from "@/components/shared/project-card";
import { projects, getProjectBySlug } from "@/data/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const relatedProjects = projects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 2);

  return (
    <>
      <Header />
      <main
        className="pt-28 pb-20"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div className="container-width">
          {/* Back */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:text-[var(--accent-color)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={14} />
            Quay lại danh sách dự án
          </Link>

          {/* Header */}
          <div
            className="mb-8 pb-8 border-b"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: "var(--label-bg)",
                      color: "var(--label-color)",
                      borderColor: "rgba(180, 83, 9, 0.2)",
                    }}
                  >
                    {project.category}
                  </span>
                  <span
                    className="text-xs font-medium tracking-wider uppercase"
                    style={{ color: "var(--accent-color)" }}
                  >
                    {project.year} · {project.role}
                  </span>
                </div>

                <h1
                  className="text-2xl md:text-4xl font-semibold tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {project.title}
                </h1>
                <p
                  className="mt-3 text-base md:text-lg leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {project.shortDescription}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium border px-4 py-2 rounded-xl transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  >
                    <GithubIcon size={15} />
                    GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: "var(--accent-color)",
                      color: "#ffffff",
                    }}
                  >
                    <ExternalLink size={15} />
                    Xem Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Key Impact Metrics Bar */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                {project.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <p
                      className="text-lg md:text-xl font-bold flex items-center gap-1.5"
                      style={{ color: "var(--accent-color)" }}
                    >
                      <Sparkles size={15} />
                      {metric.value}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Lightbox Gallery */}
          <ImageLightbox images={project.screenshots} title={project.title} />

          {/* Content grid */}
          <div className="grid md:grid-cols-[2fr_1fr] gap-10 md:gap-16">
            {/* Left — Detail */}
            <div className="space-y-10">
              <section>
                <h2
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Tổng quan dự án
                </h2>
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {project.description}
                </p>
              </section>

              <div className="grid sm:grid-cols-2 gap-5">
                <section
                  className="p-5 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <h2
                    className="text-base font-semibold mb-2.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    🎯 Bài toán thực tế
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.problem}
                  </p>
                </section>

                <section
                  className="p-5 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <h2
                    className="text-base font-semibold mb-2.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    💡 Giải pháp kỹ thuật
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.solution}
                  </p>
                </section>
              </div>

              {/* System Architecture Block */}
              {project.architecture && (
                <section
                  className="p-6 rounded-2xl border"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Layers size={18} style={{ color: "var(--accent-color)" }} />
                    <h2
                      className="text-base font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Kiến trúc hệ thống (System Architecture)
                    </h2>
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.architecture.summary}
                  </p>

                  <div className="space-y-3">
                    {project.architecture.layers.map((layer, index) => (
                      <div
                        key={layer.name}
                        className="p-4 rounded-xl border"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2.5">
                          <span
                            className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center text-white"
                            style={{ backgroundColor: "var(--accent-color)" }}
                          >
                            {index + 1}
                          </span>
                          <p
                            className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {layer.name}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {layer.items.map((item) => (
                            <span
                              key={item}
                              className="text-xs px-2.5 py-1 rounded-md border font-medium"
                              style={{
                                backgroundColor: "var(--bg-surface)",
                                borderColor: "var(--border-color)",
                                color: "var(--text-secondary)",
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Tính năng chính đã triển khai
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {project.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm p-3 rounded-xl border"
                      style={{
                        color: "var(--text-secondary)",
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        className="shrink-0 mt-0.5"
                        style={{ color: "var(--accent-color)" }}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right — Meta & CTA */}
            <aside className="space-y-6">
              <div
                className="border rounded-xl p-5"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: "var(--accent-color)" }}
                >
                  Tech Stack sử dụng
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-md border font-medium"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-base)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="border rounded-xl p-5 space-y-4"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-semibold tracking-widest uppercase mb-1"
                    style={{ color: "var(--accent-color)" }}
                  >
                    Vai trò đảm nhiệm
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {project.role}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-widest uppercase mb-1"
                    style={{ color: "var(--accent-color)" }}
                  >
                    Năm thực hiện
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.year}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-widest uppercase mb-1"
                    style={{ color: "var(--accent-color)" }}
                  >
                    Trạng thái
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.status === "completed"
                      ? "Đã hoàn thành & bàn giao"
                      : "Đang vận hành & phát triển"}
                  </p>
                </div>
              </div>

              {/* Project CTA Box */}
              <div
                className="border rounded-xl p-5"
                style={{
                  borderColor: "var(--accent-color)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <p
                  className="text-sm font-semibold mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  Bạn cần xây dựng hệ thống tương tự?
                </p>
                <p
                  className="text-xs leading-relaxed mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Mình có thể tư vấn kiến trúc, ước tính chi phí và lộ trình phát triển phù hợp với ngân sách của bạn.
                </p>
                <Link
                  href="/#contact"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  Nhận tư vấn & báo giá
                  <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div
              className="mt-16 pt-12 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Các dự án tiêu biểu khác
                </h2>
                <Link
                  href="/projects"
                  className="text-sm font-medium transition-colors hover:text-[var(--accent-color)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Xem tất cả →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {relatedProjects.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      <ChatWidget />
    </>
  );
}
