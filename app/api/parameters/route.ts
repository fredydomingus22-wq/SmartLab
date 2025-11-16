import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { parameterPayloadSchema } from "@/lib/validators";
import { z } from "zod";

const updateSchema = parameterPayloadSchema.extend({
  id: z.string().uuid(),
});

const deleteSchema = z.object({ id: z.string().uuid() });

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabase
      .from("parameters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  }

  const { data, error } = await supabase
    .from("parameters")
    .select("*")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const payload = parameterPayloadSchema.parse(await request.json());
  const { data, error } = await supabase
    .from("parameters")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: Request) {
  const supabase = createSupabaseServerClient();
  const payload = updateSchema.parse(await request.json());

  const { data, error } = await supabase
    .from("parameters")
    .update({
      name: payload.name,
      unit: payload.unit,
      input_type: payload.input_type,
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
  const { error } = await supabase.from("parameters").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
