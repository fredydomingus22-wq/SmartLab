"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ProductParameterForm, type ProductParameterFormValues } from "@/components/forms/product-parameter-form";
import { Button } from "@/components/ui/button";

interface AssignedParameter {
  id: string;
  parameter_id: string;
  min_value: number | null;
  target_value: number | null;
  max_value: number | null;
  order_index: number;
  required: boolean;
  parameters: {
    id: string;
    name: string;
    unit: string;
    input_type: string;
  } | null;
}

interface ProductParametersManagerProps {
  productId: string;
  assigned: AssignedParameter[];
  availableParameters: { id: string; name: string; unit: string }[];
}

export function ProductParametersManager({
  productId,
  assigned,
  availableParameters,
}: ProductParametersManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleCreate(values: ProductParameterFormValues) {
    await fetch("/api/product-parameters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, product_id: productId }),
    });
    startTransition(() => router.refresh());
  }

  async function handleDelete(id: string) {
    await fetch("/api/product-parameters", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-md border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Parameter
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Min / Target / Max
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Required
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {assigned.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No parameters linked yet.
                </td>
              </tr>
            ) : (
              assigned.map((link) => (
                <tr key={link.id}>
                  <td className="px-4 py-3 text-sm font-medium">
                    {link.parameters?.name ?? "Unknown"}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({link.parameters?.unit ?? ""})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {[link.min_value, link.target_value, link.max_value]
                      .map((value) => (value ?? "—").toString())
                      .join(" / ")}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {link.required ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-sm">{link.order_index}</td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDelete(link.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div>
        <p className="mb-4 text-sm font-semibold text-muted-foreground">
          Add Parameter
        </p>
        <ProductParameterForm
          parameters={availableParameters}
          onSubmit={handleCreate}
          submitLabel={isPending ? "Linking..." : "Link Parameter"}
        />
      </div>
    </div>
  );
}
