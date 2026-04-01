import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/site";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/donor";

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(absoluteUrl(next));
}
