
// app/api/data-intelligence/correlations/route.ts
import { NextResponse } from "next/server";
import { calcCorrelations } from "@/lib/analytics";

export async function GET() {
  const correlationsData = calcCorrelations({});
  return NextResponse.json(correlationsData);
}
