import type { Locale } from "./config";
import type { Messages } from "./translator";

// File JSON được sinh bởi `npm run translate`. Ngôn ngữ gốc (vi) không cần file.
const loaders: Record<Locale, () => Promise<Messages>> = {
  vi: async () => ({}),
  en: () => import("./messages/en.json").then((m) => m.default as Messages),
};

export function getMessages(locale: Locale): Promise<Messages> {
  return loaders[locale]();
}
