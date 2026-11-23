import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className="group flex flex-col border rounded-xl overflow-hidden bg-[var(--bg-surface)] transition-all duration-200 hover:border-[var(--accent-color)]/40 hover:shadow-md"
      style={{ borderColor: "var(--border-color)" }}
    >
      {/* Screenshot */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative aspect-[16/9] overflow-hidden block"
        style={{ background: "var(--muted)" }}
      >
        {project.screenshots[0] ? (
          <Image
            src={project.screenshots[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Screenshot
            </span>
          </div>
        )}

        {/* Category & Status overlay badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border shadow-2xs"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#1e293b",
              borderColor: "rgba(0,0,0,0.08)",
            }}
          >
            {project.category}
          </span>

          {project.status === "in-progress" && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-950/85 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Project
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <Link
              href={`/projects/${project.slug}`}
              className="font-semibold text-base leading-snug transition-colors group-hover:text-[var(--accent-color)]"
              style={{ color: "var(--text-primary)" }}
            >
              {project.title}
            </Link>
            <span
              className="text-xs font-medium shrink-0 px-2 py-0.5 rounded"
              style={{
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-base)",
              }}
            >
              {project.year}
            </span>
          </div>

          <p
            className="text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.shortDescription}
          </p>

          {/* Top Metrics Preview */}
          {project.metrics && project.metrics.length > 0 && (
            <div
              className="grid grid-cols-2 gap-2 p-2.5 rounded-lg border mb-4"
              style={{
                backgroundColor: "var(--bg-base)",
                borderColor: "var(--border-color)",
              }}
            >
              {project.metrics.slice(0, 2).map((m) => (
                <div key={m.label} className="min-w-0">
                  <p
                    className="text-xs font-bold truncate flex items-center gap-1"
                    style={{ color: "var(--accent-color)" }}
                  >
                    <Sparkles size={11} className="shrink-0" />
                    {m.value}
                  </p>
                  <p
                    className="text-[11px] truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-0.5 rounded-md border"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span
                className="text-xs px-2 py-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer links */}
        <div
          className="flex items-center justify-between pt-3 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--accent-color)]"
            style={{ color: "var(--text-primary)" }}
          >
            Xem Case Study
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-2.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="Source / GitHub"
                className="transition-colors hover:text-[var(--accent-color)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <GithubIcon size={16} />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                title="Xem bản chạy thực tế"
                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <span>Live</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
