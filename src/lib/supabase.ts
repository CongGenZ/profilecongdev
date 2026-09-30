import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

function getUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  return url;
}

function getPublishableKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set");
  return key;
}

// Client dùng phía client (browser) — chỉ có quyền theo RLS policy
let _supabase: ReturnType<typeof createClient<Database>> | null = null;
export function getSupabaseClient() {
  if (!_supabase) _supabase = createClient<Database>(getUrl(), getPublishableKey());
  return _supabase;
}

// Backward compat default export (lazy getter)
export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_target, prop) {
    return (getSupabaseClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Client dùng phía server (Server Actions, API routes) — bypass RLS
export function createServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient<Database>(getUrl(), serviceKey, {
    auth: { persistSession: false },
  });
}
