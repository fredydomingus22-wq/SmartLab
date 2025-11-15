import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockProducts = [
  { id: "1", name: "Orange Soda", code: "PROD-001", type: "finished", status: "active" },
  { id: "2", name: "Lemon Base", code: "PROD-110", type: "intermediate", status: "active" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage finished goods and intermediates.</p>
        </div>
        <Button asChild>
          <Link href="/products/create">New Product</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Code", accessor: "code" },
              { header: "Type", accessor: "type" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockProducts}
          />
        </CardContent>
      </Card>
    </div>
  );
}
