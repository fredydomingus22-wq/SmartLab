
// app/api/data-intelligence/nc/route.ts
import { NextResponse } from "next/server";
import type { Nonconformity } from "@/types/data-intelligence";

export async function GET() {
  const mockNonconformities: Nonconformity[] = [
    { nc_id: "NC001", sample_id: "S002", parameter_id: "P002", deviation_type: "OOS", root_cause: "Contamination", corrective_action: "Recalibrate" },
  ];
  return NextResponse.json(mockNonconformities);
}
