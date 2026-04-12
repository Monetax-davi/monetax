import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");
  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, color, icon)")
    .eq("user_id", user_id)
    .order("date", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from("transactions").insert(body).select().single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const user_id = req.nextUrl.searchParams.get("user_id");
  if (!id || !user_id) return NextResponse.json({ error: "id and user_id required" }, { status: 400 });

  const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", user_id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
