import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/shared/project-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { ChatWidget } from "@/components/shared/chat-widget";
import { getI18n } from "@/i18n/server";
import { locales, localePath } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return {
    title: t("Tất cả dự án & Case Studies"),
    description: t(
      "Danh sách các dự án website, hệ thống Microservices và ứng dụng thực tế đã thực hiện bởi Cong Dev.",
    ),
    alternates: {
      canonical: localePath(locale, "/projects"),
      languages: Object.fromEntries(locales.map((l) => [l, localePath(l, "/projects")])),
    },
  };
}

export default async function ProjectsPage() {
  const { t, tr, href } = await getI18n();
  return (
    <>
      <Header />
      <main
        className="min-h-screen pt-28 pb-20"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div className="container-width">
          <div className="mb-8">
            <Link
              href={href("/")}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent-color)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft size={16} />
              {t("Quay lại trang chủ")}
            </Link>
          </div>

          <div className="mb-12">
            <SectionHeading
              label="Portfolio & Case Studies"
              title={t("Tất cả dự án đã triển khai")}
              description={t("Tổng hợp các dự án website, hệ thống Microservices và giải pháp phần mềm mình đã xây dựng và tham gia phát triển.")}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {tr(projects).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      <ChatWidget />
    </>
  );
}
