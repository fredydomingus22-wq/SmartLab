
// app/api/data-intelligence/parameters/route.ts
import { NextResponse } from "next/server";
import type { Parameter } from "@/types/data-intelligence";

export async function GET() {
  const mockParameters: Parameter[] = [
    { parameter_id: "P001", name: "pH", spec_min: 10, spec_max: 10.5, method: "M001", frequency_required: "hourly", criticality_level: "critical" },
    { parameter_id: "P002", name: "Brix", spec_min: 5, spec_max: 6, method: "M002", frequency_required: "hourly", criticality_level: "major" },
  ];
  return NextResponse.json(mockParameters);
}
