
// app/api/data-intelligence/samples/route.ts
import { NextResponse } from "next/server";
import type { Sample } from "@/types/data-intelligence";

export async function GET() {
  const mockSamples: Sample[] = [
    { sample_id: "S001", sample_type: 'final', product_code: "P01", lot_no: "L001", production_line: "L1", collection_point: "CP1", collected_by: "user1", collected_at: new Date().toISOString(), status: 'validated' },
    { sample_id: "S002", sample_type: 'intermediate', product_code: "P02", lot_no: "L002", production_line: "L2", collection_point: "CP2", collected_by: "user2", collected_at: new Date().toISOString(), status: 'in_analysis' },
  ];
  return NextResponse.json(mockSamples);
}
