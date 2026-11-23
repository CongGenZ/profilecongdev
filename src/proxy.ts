import { NextResponse, type NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales } from "@/i18n/config";

function getLocale(request: NextRequest): string {
  // 1) Người dùng đã chọn ngôn ngữ trước đó
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (hasLocale(cookie)) return cookie;

  // 2) Ngôn ngữ trình duyệt
  const headers = { "accept-language": request.headers.get("accept-language") ?? "" };
  const languages = new Negotiator({ headers }).languages();
  try {
    return match(languages, [...locales], defaultLocale);
  } catch {
    return defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasPrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasPrefix) return;

  request.nextUrl.pathname = `/${getLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Bỏ qua API, file nội bộ của Next và mọi file tĩnh có phần mở rộng (ảnh, favicon, sitemap.xml...)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
