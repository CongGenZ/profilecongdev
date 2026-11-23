import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { locales, localePath } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://profilecongdev.vercel.app";

  const pages: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
    ...projects.map((p) => ({
      path: `/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // Mỗi trang có một URL cho từng ngôn ngữ, kèm hreflang trỏ sang các bản còn lại.
  return pages.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: `${baseUrl}${localePath(locale, path)}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}${localePath(l, path)}`]),
        ),
      },
    })),
  );
}
