import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className="group border rounded-lg overflow-hidden bg-[var(--bg-surface)] transition-all duration-200 hover:border-[var(--accent-color)]/30 hover:shadow-sm"
      style={{ borderColor: "var(--border-color)" }}
    >
      {/* Screenshot */}
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={{ background: "var(--muted)" }}
      >
        {project.screenshots[0] ? (
          <Image
            src={project.screenshots[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            className="font-semibold text-base leading-snug"
            style={{ color: "var(--text-primary)" }}
          >
            {project.title}
          </h3>
          <span
            className="text-xs shrink-0 pt-0.5"
            style={{ color: "var(--text-secondary)" }}
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

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded border"
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

        {/* Footer links */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--accent-color)]"
            style={{ color: "var(--text-primary)" }}
          >
            Xem chi tiết
            <ArrowRight size={14} />
          </Link>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
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
                className="transition-colors hover:text-[var(--accent-color)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
