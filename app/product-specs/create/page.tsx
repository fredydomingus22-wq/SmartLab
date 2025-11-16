import Link from "next/link";
import { ProductSpecForm } from "@/components/forms/product-spec-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  { id: "1", name: "Orange Soda" },
  { id: "2", name: "Lemon Base" },
];

const parameters = [
  { id: "1", name: "Brix", unit: "°Bx" },
  { id: "2", name: "pH" },
  { id: "3", name: "CO₂", unit: "g/L" },
];

export default function CreateProductSpecPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">New Product Specification</h1>
          <p className="text-muted-foreground">Link product parameters to operating limits.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/product-specs">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Specification Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductSpecForm
            products={products}
            parameters={parameters}
          />
        </CardContent>
      </Card>
    </div>
  );
}
