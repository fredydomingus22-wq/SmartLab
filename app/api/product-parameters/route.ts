import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { productParameterPayloadSchema } from "@/lib/validators";
import { z } from "zod";

const updateSchema = productParameterPayloadSchema.extend({
  id: z.string().uuid(),
});

const deleteSchema = z.object({ id: z.string().uuid() });

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  let query = supabase
    .from("product_parameters")
    .select(
      `id, product_id, parameter_id, min_value, target_value, max_value, order_index, required,
       parameters:parameter_id (id, name, unit, input_type)`
    )
    .order("order_index", { ascending: true });

  if (productId) {
    query = query.eq("product_id", productId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const payload = productParameterPayloadSchema.parse(await request.json());

  const { data, error } = await supabase
    .from("product_parameters")
    .insert(payload)
    .select(
      `id, product_id, parameter_id, min_value, target_value, max_value, order_index, required,
       parameters:parameter_id (id, name, unit, input_type)`
    )
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
    .from("product_parameters")
    .update({
      min_value: payload.min_value,
      target_value: payload.target_value,
      max_value: payload.max_value,
      order_index: payload.order_index,
      required: payload.required,
    })
    .eq("id", payload.id)
    .select(
      `id, product_id, parameter_id, min_value, target_value, max_value, order_index, required,
       parameters:parameter_id (id, name, unit, input_type)`
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const supabase = createSupabaseServerClient();
  const { id } = deleteSchema.parse(await request.json());
  const { error } = await supabase
    .from("product_parameters")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
