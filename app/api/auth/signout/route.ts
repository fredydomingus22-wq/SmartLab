import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(_: Request) {
  try {
    const cookieStore = cookies();
    const sbUserCookie = cookieStore.get("sb-user");
    const sbUserData = sbUserCookie?.value ? JSON.parse(decodeURIComponent(sbUserCookie.value)) : null;
    const userId = sbUserData?.id;

    if (userId && SUPABASE_SERVICE_ROLE) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
          auth: { persistSession: false },
        });
        await supabase.auth.admin.deleteUser(userId);
      } catch (adminErr) {
        // Log but don't fail the logout if admin delete fails
        console.error("Failed to revoke user session:", adminErr);
      }
    }
  } catch (err) {
    console.error("Error during signout:", err);
  }

  const secure = process.env.NODE_ENV === "production";
  const sameSite = secure ? "SameSite=Strict" : "SameSite=Lax";
  const cookie = `sb-user=; Path=/; HttpOnly; ${sameSite}; Max-Age=0${secure ? "; Secure" : ""}`;
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
