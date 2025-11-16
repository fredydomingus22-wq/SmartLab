"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductForm, type ProductFormValues } from "@/components/forms/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateProductPage() {
  const router = useRouter();

  async function handleSubmit(values: ProductFormValues) {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    router.push("/products");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Product</h1>
          <p className="text-muted-foreground">Define a new SKU or intermediate formula.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/products">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
