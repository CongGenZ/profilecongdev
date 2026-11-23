import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { translateTexts, TranslationError } from "@/lib/translate";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// ─── Giới hạn ──────────────────────────────────────────────────────────────

const MAX_TEXTS = 50;
const MAX_TEXT_LENGTH = 5000;
const MAX_TOTAL_CHARS = 20_000;

// 20 request / phút / IP. Bản dịch đã cache vẫn tính vào giới hạn.
const checkRateLimit = createRateLimiter(20, 60_000);

// ─── Schema ────────────────────────────────────────────────────────────────

const langCode = z
  .string()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, "Mã ngôn ngữ không hợp lệ (vd: vi, en)");

const bodySchema = z
  .object({
    texts: z.array(z.string().max(MAX_TEXT_LENGTH)).min(1).max(MAX_TEXTS),
    target: langCode,
    source: langCode.optional().default("vi"),
  })
  .refine((b) => b.texts.reduce((n, t) => n + t.length, 0) <= MAX_TOTAL_CHARS, {
    message: `Tổng độ dài các chuỗi không được vượt quá ${MAX_TOTAL_CHARS} ký tự`,
  });

export type TranslateRequest = z.input<typeof bodySchema>;

export interface TranslateResponse {
  translations: string[];
  cached: boolean[];
}

// ─── Bảo vệ: chỉ cho phép gọi từ chính website, hoặc kèm API key ──────────

function isAllowed(req: NextRequest): boolean {
  const apiKey = process.env.TRANSLATE_API_KEY;
  const sentKey = req.headers.get("x-api-key");
  if (apiKey && sentKey) return sentKey === apiKey;

  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin) return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const allowedHosts = new Set<string>([req.nextUrl.host]);
  const host = req.headers.get("host");
  if (host) allowedHosts.add(host);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      allowedHosts.add(new URL(siteUrl).host);
    } catch {}
  }
  return allowedHosts.has(originHost);
}

// ─── POST /api/translate ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!isAllowed(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!checkRateLimit(getClientIp(req.headers))) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu dịch. Vui lòng thử lại sau ít phút." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body phải là JSON hợp lệ" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  const { texts, target, source } = parsed.data;

  try {
    const result = await translateTexts(texts, target, source);
    return NextResponse.json<TranslateResponse>(result);
  } catch (error) {
    if (error instanceof TranslationError) {
      console.error("[translate]", error.message);
      return NextResponse.json({ error: "Không thể dịch nội dung này" }, { status: 422 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Dịch vụ dịch đang quá tải, thử lại sau" },
        { status: 503, headers: { "Retry-After": "30" } },
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("[translate] ANTHROPIC_API_KEY không hợp lệ hoặc chưa cấu hình");
      return NextResponse.json({ error: "Dịch vụ dịch chưa được cấu hình" }, { status: 503 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`[translate] Anthropic API error ${error.status}:`, error.message);
      return NextResponse.json({ error: "Lỗi dịch vụ dịch" }, { status: 502 });
    }
    console.error("[translate] unexpected error:", error);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
