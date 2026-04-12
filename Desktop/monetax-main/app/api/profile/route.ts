import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user_id).single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { user_id, ...updates } = await req.json();
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", user_id).select().single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
