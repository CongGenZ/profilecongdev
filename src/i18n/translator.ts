// Bộ dịch kiểu gettext: chuỗi tiếng Việt gốc chính là key.
//   t("Liên hệ")                       → "Contact" (khi lang = en)
//   t("Chào {name}!", { name: "An" })  → "Hi An!"
//   tr(projects)                       → bản sao của dữ liệu với mọi chuỗi tiếng Việt đã được dịch
// Thiếu bản dịch thì trả về chuỗi gốc, nên trang không bao giờ bị trống chữ.

export type Messages = Record<string, string>;
export type TranslateVars = Record<string, string | number>;

/** Chuỗi có chứa chữ tiếng Việt có dấu → cần dịch. Chuỗi ASCII (tên công nghệ, URL, số) giữ nguyên. */
const VIETNAMESE_CHARS =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

export function needsTranslation(text: string): boolean {
  return VIETNAMESE_CHARS.test(text);
}

/** Các field không bao giờ dịch khi dùng tr() */
const SKIP_KEYS = new Set([
  "slug",
  "id",
  "icon",
  "href",
  "email",
  "phone",
  "github",
  "linkedin",
  "avatar",
  "logo",
  "screenshots",
  "demoUrl",
  "githubUrl",
  "mapEmbedUrl",
  "mapDirectionsUrl",
  "status",
  "category",
]);

function interpolate(text: string, vars?: TranslateVars): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, key) =>
    key in vars ? String(vars[key]) : m,
  );
}

export function createTranslator(messages: Messages) {
  function t(source: string, vars?: TranslateVars): string {
    return interpolate(messages[source] ?? source, vars);
  }

  function tr<T>(value: T, key?: string): T {
    if (key && SKIP_KEYS.has(key)) return value;
    if (typeof value === "string") return t(value) as T;
    if (Array.isArray(value)) return value.map((v) => tr(v)) as T;
    if (value && typeof value === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) out[k] = tr(v, k);
      return out as T;
    }
    return value;
  }

  return { t, tr };
}

export type Translator = ReturnType<typeof createTranslator>;

/**
 * Gom tất cả chuỗi cần dịch trong một object dữ liệu (dùng cho script).
 * Áp dụng cùng luật SKIP_KEYS với tr() để hai bên luôn khớp nhau.
 */
export function collectStrings(value: unknown, out = new Set<string>(), key?: string) {
  if (key && SKIP_KEYS.has(key)) return out;
  if (typeof value === "string") {
    if (needsTranslation(value)) out.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectStrings(v, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) collectStrings(v, out, k);
  }
  return out;
}
