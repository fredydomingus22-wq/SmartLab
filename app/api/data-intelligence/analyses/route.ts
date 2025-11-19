
// app/api/data-intelligence/analyses/route.ts
import { NextResponse } from "next/server";
import type { Analysis } from "@/types/data-intelligence";

export async function GET() {
  const mockAnalyses: Analysis[] = [
    { analysis_id: "A001", sample_id: "S001", parameter_id: "P001", method_id: "M001", result_value: 10.2, unit: "pH", limit_min: 10, limit_max: 10.5, analyst: "user1", analysis_date: new Date().toISOString(), validation_status: 'approved' },
    { analysis_id: "A002", sample_id: "S002", parameter_id: "P002", method_id: "M002", result_value: 5.5, unit: "Brix", limit_min: 5, limit_max: 6, analyst: "user2", analysis_date: new Date().toISOString(), validation_status: 'failed' },
  ];
  return NextResponse.json(mockAnalyses);
}
