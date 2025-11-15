import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockSpecs = [
  { id: "1", product: "Orange Soda", parameter: "Brix", min: "11.8", target: "12.0", max: "12.2" },
  { id: "2", product: "Orange Soda", parameter: "pH", min: "3.0", target: "3.2", max: "3.4" },
];

export default function ProductSpecsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Specifications</h1>
          <p className="text-muted-foreground">Define quality targets and limits.</p>
        </div>
        <Button asChild>
          <Link href="/product-specs/create">New Specification</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Specification Library</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Product", accessor: "product" },
              { header: "Parameter", accessor: "parameter" },
              { header: "Min", accessor: "min" },
              { header: "Target", accessor: "target" },
              { header: "Max", accessor: "max" },
            ]}
            data={mockSpecs}
          />
        </CardContent>
      </Card>
    </div>
  );
}
