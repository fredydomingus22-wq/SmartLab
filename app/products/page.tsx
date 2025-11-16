import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";
import { createSupabaseServerClient } from "@/lib/supabase-server";

interface ProductRow {
  id: string;
  name: string;
  code: string;
  stage: string;
  category: string | null;
  line: string | null;
  active: boolean;
}

export default async function ProductsPage() {
  let products: ProductRow[] = [];

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, code, stage, category, line, active")
      .order("updated_at", { ascending: false });
    if (error) {
      console.error(error.message);
    } else if (data) {
      products = data;
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage intermediates and finished goods without touching code.
          </p>
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
          <SimpleTable<ProductRow>
            columns={[
              {
                header: "Name",
                accessor: (product: ProductRow) => (
                  <Link href={`/products/${product.id}`} className="font-medium text-primary hover:underline">
                    {product.name}
                  </Link>
                ),
              },
              { header: "Code", accessor: "code" },
              { header: "Stage", accessor: "stage" },
              { header: "Category", accessor: (product) => product.category ?? "—" },
              { header: "Line", accessor: (product) => product.line ?? "—" },
              {
                header: "Active",
                accessor: (product) => (
                  <span className={product.active ? "text-green-600" : "text-destructive"}>
                    {product.active ? "Yes" : "No"}
                  </span>
                ),
              },
            ]}
            data={products}
            emptyMessage="No products yet. Use the action button above to create one."
          />
        </CardContent>
      </Card>
    </div>
  );
}
