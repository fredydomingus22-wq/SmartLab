
// app/api/data-intelligence/spc/route.ts
import { NextResponse } from "next/server";
import { calcSPC } from "@/lib/analytics";

export async function GET() {
  const spcData = calcSPC({});
  return NextResponse.json(spcData);
}
