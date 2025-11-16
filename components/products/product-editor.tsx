"use client";

import { ProductForm, type ProductFormValues } from "@/components/forms/product-form";
import { useRouter } from "next/navigation";

interface ProductEditorProps {
  productId: string;
  initialValues: ProductFormValues;
}

export function ProductEditor({ productId, initialValues }: ProductEditorProps) {
  const router = useRouter();

  async function handleSubmit(values: ProductFormValues) {
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, id: productId }),
    });
    router.refresh();
  }

  return (
    <ProductForm
      onSubmit={handleSubmit}
      defaultValues={initialValues}
      submitLabel="Update Product"
    />
  );
}
