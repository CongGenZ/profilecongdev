import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/shared/project-card";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Tất cả dự án | Cong Dev",
  description: "Danh sách các dự án website và ứng dụng đã thực hiện bởi Cong Dev.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen py-20" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="container-width">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent-color)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={16} />
            Quay lại trang chủ
          </Link>
        </div>

        <div className="mb-12">
          <SectionHeading
            label="Portfolio"
            title="Tất cả dự án"
            description="Tổng hợp các dự án website, ứng dụng và giải pháp phần mềm mình đã xây dựng và tham gia phát triển."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
