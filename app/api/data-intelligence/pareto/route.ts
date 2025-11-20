
// app/api/data-intelligence/pareto/route.ts
import { NextResponse } from "next/server";
import { calcPareto } from "@/lib/analytics";

export async function GET() {
  const paretoData = calcPareto({});
  return NextResponse.json(paretoData);
}
