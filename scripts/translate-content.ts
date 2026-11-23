/**
 * Dịch nội dung tĩnh của website sang các ngôn ngữ khác.
 *
 *   npm run translate            # dịch các chuỗi mới / đã đổi, xóa chuỗi không còn dùng
 *   npm run translate -- --dry   # chỉ liệt kê, không gọi AI, không ghi file
 *   npm run translate -- --force # dịch lại toàn bộ
 *
 * Nguồn chuỗi:
 *   1. Mọi lời gọi t("...") trong src/
 *   2. Dữ liệu trong src/data/* (giống cách tr() duyệt object ở runtime)
 *   3. Chuỗi tiếng Việt ở các field label/desc/text/message trong components & actions,
 *      và thông báo lỗi trong src/lib/validations.ts
 *
 * Kết quả: src/i18n/messages/<locale>.json — key là câu tiếng Việt gốc, value là bản dịch.
 * Nên xem lại file JSON trước khi commit; có thể sửa tay, lần chạy sau sẽ giữ nguyên bản đã sửa.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

import { defaultLocale, locales } from "../src/i18n/config";
import { collectStrings, needsTranslation } from "../src/i18n/translator";
import { chunk, getTranslateModel, translateWithClaude } from "../src/lib/translate/claude";

import { projects } from "../src/data/projects";
import { profile } from "../src/data/profile";
import { services } from "../src/data/services";
import { techStack, workSteps } from "../src/data/tech-stack";
import { experiences, testimonials } from "../src/data/experience";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const MESSAGES_DIR = join(SRC, "i18n", "messages");

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");
const FORCE = args.has("--force");

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(join(ROOT, file));
  } catch {
    /* file không tồn tại */
  }
}

// ─── Thu thập chuỗi ────────────────────────────────────────────────────────

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

/** Giải mã chuỗi JS trong dấu nháy kép ("...") */
function unquote(body: string): string {
  try {
    return JSON.parse(`"${body}"`);
  } catch {
    return body;
  }
}

const T_CALL = /(?<![\w.])t\(\s*"((?:\\.|[^"\\])*)"/g;
const FIELD_LITERAL = /\b(?:label|desc|text|message)\s*:\s*"((?:\\.|[^"\\])*)"/g;
const ANY_LITERAL = /"((?:\\.|[^"\\])*)"/g;

function collectFromSource(): Map<string, Set<string>> {
  const found = new Map<string, Set<string>>(); // chuỗi → các file dùng nó
  const add = (text: string, file: string) => {
    if (!text.trim()) return;
    if (!found.has(text)) found.set(text, new Set());
    found.get(text)!.add(relative(ROOT, file));
  };

  for (const file of walk(SRC)) {
    const rel = relative(SRC, file).replace(/\\/g, "/");
    if (rel.startsWith("app/api/") || rel.startsWith("i18n/")) continue;
    const code = readFileSync(file, "utf8");

    for (const m of code.matchAll(T_CALL)) add(unquote(m[1]), file);

    if (rel.startsWith("components/") || rel.startsWith("actions/")) {
      for (const m of code.matchAll(FIELD_LITERAL)) {
        const s = unquote(m[1]);
        if (needsTranslation(s)) add(s, file);
      }
    }
    if (rel === "lib/validations.ts") {
      for (const m of code.matchAll(ANY_LITERAL)) {
        const s = unquote(m[1]);
        if (needsTranslation(s)) add(s, file);
      }
    }
  }

  const data = { projects, profile, services, techStack, workSteps, experiences, testimonials };
  for (const [name, value] of Object.entries(data)) {
    for (const s of collectStrings(value)) add(s, `src/data (${name})`);
  }

  return found;
}

// ─── Main ──────────────────────────────────────────────────────────────────

function readMessages(file: string): Record<string, string> {
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, "utf8"));
}

function sortKeys(obj: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b, "vi")));
}

async function main() {
  const sources = collectFromSource();
  const all = [...sources.keys()];
  console.log(`Tìm thấy ${all.length} chuỗi nguồn (${defaultLocale}).`);

  for (const locale of locales) {
    if (locale === defaultLocale) continue;

    const file = join(MESSAGES_DIR, `${locale}.json`);
    const existing = readMessages(file);

    const missing = FORCE ? all : all.filter((s) => !(s in existing));
    const stale = Object.keys(existing).filter((k) => !sources.has(k));

    console.log(`\n[${locale}] thiếu: ${missing.length} · không còn dùng: ${stale.length}`);

    if (DRY) {
      for (const s of missing) console.log(`  + ${s.slice(0, 90)}  ← ${[...sources.get(s)!].join(", ")}`);
      for (const s of stale) console.log(`  - ${s.slice(0, 90)}`);
      continue;
    }

    const next: Record<string, string> = {};
    for (const s of all) if (s in existing) next[s] = existing[s];

    if (missing.length > 0) {
      if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
        console.warn("  ⚠ Chưa có ANTHROPIC_API_KEY trong .env.local — SDK sẽ thử credential khác (ant auth login).");
      }
      console.log(`  Model: ${getTranslateModel()}`);
      const batches = chunk(missing);
      for (const [i, batch] of batches.entries()) {
        process.stdout.write(`  Lô ${i + 1}/${batches.length} (${batch.length} chuỗi)... `);
        const out = await translateWithClaude(batch, locale, defaultLocale);
        batch.forEach((s, j) => (next[s] = out[j]));
        // Ghi sau mỗi lô để không mất tiến độ nếu lô sau lỗi
        writeFileSync(file, JSON.stringify(sortKeys(next), null, 2) + "\n", "utf8");
        console.log("xong");
      }
    }

    writeFileSync(file, JSON.stringify(sortKeys(next), null, 2) + "\n", "utf8");
    console.log(`  → ${relative(ROOT, file)} (${Object.keys(next).length} chuỗi)`);
  }
}

main().catch((err) => {
  console.error("\n✖ Dịch thất bại:", err instanceof Error ? err.message : err);
  process.exit(1);
});
