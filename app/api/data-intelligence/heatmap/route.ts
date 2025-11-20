
// app/api/data-intelligence/heatmap/route.ts
import { NextResponse } from "next/server";
import { calcHeatmap } from "@/lib/analytics";

export async function GET() {
  const heatmapData = calcHeatmap({});
  return NextResponse.json(heatmapData);
}
