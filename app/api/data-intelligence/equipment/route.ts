
// app/api/data-intelligence/equipment/route.ts
import { NextResponse } from "next/server";
import type { Equipment } from "@/types/data-intelligence";

export async function GET() {
  const mockEquipment: Equipment[] = [
    { equipment_id: "EQ001", name: "pH Meter", calibration_due_date: "2025-12-31T00:00:00Z", last_calibrated: "2025-11-01T00:00:00Z", status: "ok" },
    { equipment_id: "EQ002", name: "Refractometer", calibration_due_date: "2025-11-15T00:00:00Z", last_calibrated: "2025-10-15T00:00:00Z", status: "overdue" },
  ];
  return NextResponse.json(mockEquipment);
}
