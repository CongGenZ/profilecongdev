import "server-only";
import { createHash } from "node:crypto";
import { createServerClient } from "@/lib/supabase";
import { chunk, translateWithClaude } from "./claude";

export { TranslationError } from "./claude";

export interface TranslateResult {
  translations: string[];
  cached: boolean[];
}

export function hashSource(text: string, source: string): string {
  return createHash("sha256").update(`${source}\u0000${text}`).digest("hex");
}

/** Supabase là tùy chọn: thiếu cấu hình hoặc lỗi thì vẫn dịch được, chỉ là không cache. */
function getDb() {
  try {
    return createServerClient();
  } catch {
    return null;
  }
}

/**
 * Dịch danh sách chuỗi, có cache trong bảng `translations`.
 * Chuỗi trùng nhau trong cùng request chỉ dịch một lần.
 */
export async function translateTexts(
  texts: string[],
  target: string,
  source = "vi",
): Promise<TranslateResult> {
  if (target === source) {
    return { translations: [...texts], cached: texts.map(() => true) };
  }

  const unique = [...new Set(texts.filter((t) => t.trim().length > 0))];
  const hashes = new Map(unique.map((t) => [t, hashSource(t, source)]));
  const result = new Map<string, string>();
  const fromCache = new Set<string>();

  // 1) Tra cache
  const db = getDb();
  if (db && unique.length > 0) {
    const { data, error } = await db
      .from("translations")
      .select("source_hash, translated_text")
      .eq("target_lang", target)
      .in("source_hash", [...hashes.values()]);

    if (error) {
      console.warn("[translate] cache read failed:", error.message);
    } else if (data) {
      const byHash = new Map(data.map((r) => [r.source_hash, r.translated_text]));
      for (const [text, hash] of hashes) {
        const hit = byHash.get(hash);
        if (hit !== undefined) {
          result.set(text, hit);
          fromCache.add(text);
        }
      }
    }
  }

  // 2) Dịch phần còn thiếu theo lô
  const missing = unique.filter((t) => !result.has(t));
  for (const batch of chunk(missing)) {
    const translated = await translateWithClaude(batch, target, source);
    batch.forEach((text, i) => result.set(text, translated[i]));

    // 3) Ghi cache (không chặn kết quả nếu lỗi)
    if (db) {
      const rows = batch.map((text, i) => ({
        source_hash: hashes.get(text)!,
        source_lang: source,
        target_lang: target,
        source_text: text,
        translated_text: translated[i],
      }));
      const { error } = await db
        .from("translations")
        .upsert(rows, { onConflict: "source_hash,target_lang" });
      if (error) console.warn("[translate] cache write failed:", error.message);
    }
  }

  return {
    translations: texts.map((t) => result.get(t) ?? t),
    cached: texts.map((t) => fromCache.has(t) || t.trim().length === 0),
  };
}
