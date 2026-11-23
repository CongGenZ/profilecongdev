// Dùng trong Server Components / generateMetadata. Locale lấy từ segment app/[lang].
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, localePath, type Locale } from "./config";
import { getMessages } from "./messages";
import { createTranslator } from "./translator";

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getI18n() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { t, tr } = createTranslator(messages);
  return {
    locale,
    messages,
    t,
    tr,
    href: (path: string) => localePath(locale, path),
  };
}
