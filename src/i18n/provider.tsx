"use client";

import { createContext, useContext, useMemo } from "react";
import { localePath, type Locale } from "./config";
import { createTranslator, type Messages, type Translator } from "./translator";

interface I18nContextValue extends Translator {
  locale: Locale;
  /** Gắn locale vào đường dẫn nội bộ: href("/projects") → "/en/projects" */
  href: (path: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      ...createTranslator(messages),
      href: (path: string) => localePath(locale, path),
    }),
    [locale, messages],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Dùng trong Client Components. */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
