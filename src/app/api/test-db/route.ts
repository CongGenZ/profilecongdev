import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const db = createServerClient();
    const { data, error } = await db.from("chat_sessions").select("count").limit(1);
    if (error) throw error;
    return NextResponse.json({ ok: true, message: "Kết nối Supabase thành công!", data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
