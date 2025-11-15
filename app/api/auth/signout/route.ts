import { NextResponse } from "next/server";

export async function POST(_: Request) {
  const secure = process.env.NODE_ENV === "production";
  const cookie = `sb-user=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
