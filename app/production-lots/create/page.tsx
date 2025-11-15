import Link from "next/link";
import { ProductionLotForm } from "@/components/forms/production-lot-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  { id: "1", name: "Orange Soda" },
  { id: "2", name: "Grape Soda" },
];

const lines = [
  { id: "l1", name: "Line 1" },
  { id: "l2", name: "Line 2" },
];

const shifts = [
  { id: "s1", name: "Morning" },
  { id: "s2", name: "Evening" },
];

export default function CreateProductionLotPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Production Lot</h1>
          <p className="text-muted-foreground">Start a new parent lot for blending and filling.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/production-lots">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lot Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductionLotForm
            products={products}
            lines={lines}
            shifts={shifts}
          />
        </CardContent>
      </Card>
    </div>
  );
}
