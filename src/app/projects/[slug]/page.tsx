import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <>
      <Header />
      <main
        className="pt-24 pb-20"
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
            Quay lại
          </Link>

          {/* Header */}
          <div className="mb-10 pb-8 border-b" style={{ borderColor: "var(--border-color)" }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-2"
                  style={{ color: "var(--accent-color)" }}
                >
                  {project.year} · {project.role}
                </p>
                <h1
                  className="text-2xl md:text-3xl font-semibold tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {project.title}
                </h1>
                <p
                  className="mt-2 text-base"
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
                    className="inline-flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-md transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <GithubIcon size={14} />
                    GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-md transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Main screenshot */}
          {project.screenshots[0] && (
            <div
              className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border mb-12"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--muted)",
              }}
            >
              <Image
                src={project.screenshots[0]}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1120px) 100vw, 1120px"
                priority
              />
            </div>
          )}

          {/* Content grid */}
          <div className="grid md:grid-cols-[2fr_1fr] gap-10 md:gap-16">
            {/* Left — Detail */}
            <div className="space-y-8">
              <section>
                <h2
                  className="text-base font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Tổng quan
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {project.description}
                </p>
              </section>

              <section>
                <h2
                  className="text-base font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Bài toán
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {project.problem}
                </p>
              </section>

              <section>
                <h2
                  className="text-base font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Giải pháp
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {project.solution}
                </p>
              </section>

              <section>
                <h2
                  className="text-base font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Tính năng chính
                </h2>
                <ul className="space-y-2">
                  {project.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--accent-color)" }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Extra screenshots */}
              {project.screenshots.length > 1 && (
                <section>
                  <h2
                    className="text-base font-semibold mb-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Screenshots
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.screenshots.slice(1).map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-[16/10] rounded-lg overflow-hidden border"
                        style={{
                          borderColor: "var(--border-color)",
                          backgroundColor: "var(--muted)",
                        }}
                      >
                        <Image
                          src={src}
                          alt={`${project.title} screenshot ${i + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right — Meta */}
            <aside className="space-y-6">
              <div
                className="border rounded-lg p-5"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-3"
                  style={{ color: "var(--accent-color)" }}
                >
                  Công nghệ
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 rounded border"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="border rounded-lg p-5 space-y-3"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-medium tracking-widest uppercase mb-1"
                    style={{ color: "var(--accent-color)" }}
                  >
                    Vai trò
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.role}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-medium tracking-widest uppercase mb-1"
                    style={{ color: "var(--accent-color)" }}
                  >
                    Năm
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
                    className="text-xs font-medium tracking-widest uppercase mb-1"
                    style={{ color: "var(--accent-color)" }}
                  >
                    Trạng thái
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.status === "completed" ? "Hoàn thành" : "Đang phát triển"}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
