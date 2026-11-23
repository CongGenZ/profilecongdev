"use client";

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import {
  LOCALE_COOKIE,
  localeNames,
  localePath,
  locales,
  stripLocale,
  type Locale,
} from "@/i18n/config";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  // Với 2 ngôn ngữ: bấm là chuyển sang ngôn ngữ còn lại.
  const next: Locale = locales[(locales.indexOf(locale) + 1) % locales.length];

  const switchTo = (target: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
    const rest = stripLocale(pathname);
    router.push(localePath(target, rest) + window.location.hash);
  };

  return (
    <button
      type="button"
      onClick={() => switchTo(next)}
      title={t("Chuyển sang {lang}", { lang: localeNames[next] })}
      aria-label={t("Chuyển sang {lang}", { lang: localeNames[next] })}
      className={`inline-flex items-center gap-1 h-8 px-2 rounded-lg border text-xs font-semibold uppercase transition-colors hover:border-[var(--accent-color)] cursor-pointer ${className}`}
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-surface)",
        color: "var(--text-primary)",
      }}
    >
      <Languages size={13} />
      {next}
    </button>
  );
}
