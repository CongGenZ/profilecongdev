"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { projects } from "@/data/projects";

const CATEGORIES = [
  "Tất cả",
  "Microservices & .NET",
  "E-Commerce & SaaS",
  "Realtime & System",
  "Full-stack",
] as const;

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "Tất cả") {
      return projects.filter((p) => p.featured);
    }
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <SectionHeading
            label="Projects & Case Studies"
            title="Một số dự án thực tế mình đã xây dựng"
            description="Phân tích bài toán, kiến trúc hệ thống và kết quả đạt được của từng sản phẩm."
          />
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium shrink-0 mb-4 transition-colors hover:text-[var(--accent-color)]"
            style={{ color: "var(--text-secondary)" }}
          >
            Xem tất cả ({projects.length})
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer"
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--accent-color)",
                        borderColor: "var(--accent-color)",
                        color: "#ffffff",
                      }
                    : {
                        backgroundColor: "var(--bg-base)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-secondary)",
                      }
                }
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
