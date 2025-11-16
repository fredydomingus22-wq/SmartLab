import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/auth";

const SUPABASE_URL = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = (globalThis as any).process?.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["admin_root", "plant_manager", "qa_supervisor"];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { product_id, line_id, shift_id, production_lot_code } = body;

    if (!production_lot_code || !product_id) {
      return NextResponse.json(
        { error: "Missing required fields: production_lot_code, product_id" },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
    const { data, error } = await supabase.from("production_lots").insert([
      {
        production_lot_code,
        product_id,
        line_id: line_id || null,
        shift_id: shift_id || null,
        created_by: session.user.id,
        status: "planned",
      },
    ]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data?.[0] || {}, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
