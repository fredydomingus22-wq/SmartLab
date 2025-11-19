
// app/api/data-intelligence/kpi/route.ts
import { NextResponse } from "next/server";
import { calcKPIs } from "@/lib/analytics";

export async function GET() {
  const kpis = calcKPIs({});
  return NextResponse.json(kpis);
}
