// Cấu hình ngôn ngữ dùng chung cho server, client, proxy và script.
// Thêm ngôn ngữ mới: thêm vào `locales` + `localeNames` rồi chạy `npm run translate`.

export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

/** Ngôn ngữ gốc — nội dung trong code được viết bằng ngôn ngữ này. */
export const defaultLocale: Locale = "vi";

export const localeNames: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

/** Dùng cho openGraph.locale */
export const ogLocales: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
};

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function hasLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Gắn locale vào đường dẫn nội bộ.
 * localePath("en", "/projects") → "/en/projects"
 * localePath("en", "/#contact")  → "/en#contact"
 */
export function localePath(locale: Locale, path = "/"): string {
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  if (path.startsWith("#")) return `/${locale}${path}`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `/${locale}`;
  if (clean.startsWith("/#")) return `/${locale}${clean.slice(1)}`;
  return `/${locale}${clean}`;
}

/** Bỏ locale khỏi pathname: "/en/projects" → "/projects" */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (hasLocale(seg)) {
    const rest = pathname.slice(seg.length + 1);
    return rest || "/";
  }
  return pathname;
}
