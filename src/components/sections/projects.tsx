import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { getFeaturedProjects } from "@/data/projects";

export function Projects() {
  const featured = getFeaturedProjects();

  return (
    <section
      id="projects"
      className="section-padding border-t"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="container-width">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeading
            label="Projects"
            title="Một số dự án mình đã thực hiện"
          />
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm shrink-0 mb-1 transition-colors hover:text-[var(--accent-color)]"
            style={{ color: "var(--text-secondary)" }}
          >
            Tất cả dự án
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
