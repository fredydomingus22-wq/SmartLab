import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { productPayloadSchema } from "@/lib/validators";
import { z } from "zod";

function legacyType(stage: "intermediate" | "final") {
  return stage === "intermediate" ? "intermediate" : "finished";
}

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const payload = productPayloadSchema.parse(await request.json());
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: payload.name,
      code: payload.code,
      stage: payload.type,
      type: legacyType(payload.type),
      category: payload.category,
      line: payload.line,
      active: payload.active,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

const updateSchema = productPayloadSchema.extend({
  id: z.string().uuid(),
});

const deleteSchema = z.object({ id: z.string().uuid() });

export async function PUT(request: Request) {
  const supabase = createSupabaseServerClient();
  const payload = updateSchema.parse(await request.json());

  const { data, error } = await supabase
    .from("products")
    .update({
      name: payload.name,
      code: payload.code,
      stage: payload.type,
      type: legacyType(payload.type),
      category: payload.category,
      line: payload.line,
      active: payload.active,
    })
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const supabase = createSupabaseServerClient();
  const { id } = deleteSchema.parse(await request.json());

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
