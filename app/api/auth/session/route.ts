import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accessToken = body.access_token as string | undefined;
    if (!accessToken) {
      return NextResponse.json({ error: "Missing access_token" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    // Verify the access token and get user information
    const userResult = await supabase.auth.getUser(accessToken as any);
    const user = (userResult as any)?.data?.user ?? (userResult as any)?.user;
    const userError = (userResult as any)?.error;
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid access token" }, { status: 401 });
    }

    // Lookup application role from `users` table. If user record does not
    // exist, create it with the default role (auditor_readonly). This ensures
    // app-level role mapping exists on first sign-in.
    const DEFAULT_ROLE = "auditor_readonly";

    // try find an existing user mapping
    const { data: existingUser } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", user.id)
      .maybeSingle();

    let roleName = DEFAULT_ROLE;

    if (existingUser?.role_id) {
      const { data: roleRow } = await supabase.from("roles").select("name").eq("id", existingUser.role_id).maybeSingle();
      if (roleRow?.name) roleName = roleRow.name;
    } else {
      // ensure the default role exists and get its id
      const { data: roleRow } = await supabase.from("roles").select("id,name").eq("name", DEFAULT_ROLE).maybeSingle();
      const roleId = roleRow?.id;
      if (roleId) {
        // upsert user mapping with the default role
        await supabase.from("users").upsert({ id: user.id, role_id: roleId }, { onConflict: "id" });
        roleName = DEFAULT_ROLE;
      }
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      role: roleName,
    };

    // Set HttpOnly cookie (1 week) with Strict SameSite in production
    const cookieVal = encodeURIComponent(JSON.stringify(sessionUser));
    const secure = process.env.NODE_ENV === "production";
    const sameSite = secure ? "SameSite=Strict" : "SameSite=Lax";
    const cookie = `sb-user=${cookieVal}; Path=/; HttpOnly; ${sameSite}; Max-Age=${60 * 60 * 24 * 7}${secure ? "; Secure" : ""}`;

    const res = NextResponse.json({ ok: true });
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
