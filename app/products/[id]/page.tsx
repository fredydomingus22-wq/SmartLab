import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase";
import { ProductEditor } from "@/components/products/product-editor";
import type { ProductFormValues } from "@/components/forms/product-form";
import { ProductParametersManager } from "@/components/products/product-parameters-manager";

interface ProductDetailPageProps {
  params: { id: string };
}

type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let supabase: SupabaseServerClient;
  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    console.error(error);
    notFound();
  }
  const { data: product, error } = await supabase
    .from("products")
    .select("id, name, code, category, line, stage, active")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  const [{ data: assigned }, { data: parameters }] = await Promise.all([
    supabase
      .from("product_parameters")
      .select(
        `id, product_id, parameter_id, min_value, target_value, max_value, order_index, required,
         parameters:parameter_id (id, name, unit, input_type)`
      )
      .eq("product_id", params.id)
      .order("order_index", { ascending: true }),
    supabase.from("parameters").select("id, name, unit").order("name"),
  ]);

  const initialValues: ProductFormValues = {
    name: product.name,
    code: product.code,
    category: product.category ?? "",
    line: product.line ?? "",
    type: product.stage === "intermediate" ? "intermediate" : "final",
    active: product.active ?? true,
  };

  const availableParameters = (parameters ?? []).filter(
    (parameter) => !(assigned ?? []).some((link) => link.parameter_id === parameter.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground">Update master data and linked specs.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductEditor productId={product.id} initialValues={initialValues} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Linked Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductParametersManager
            productId={product.id}
            assigned={assigned ?? []}
            availableParameters={availableParameters}
          />
        </CardContent>
      </Card>
    </div>
  );
}
