"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const schema = z.object({
  parameterId: z.string(),
  productId: z.string(),
  specType: z.enum(["raw_material", "intermediate", "finished"]),
  minValue: z.string().optional(),
  targetValue: z.string().optional(),
  maxValue: z.string().optional(),
  toleranceType: z.string().optional(),
});

export type ProductSpecFormValues = z.infer<typeof schema>;

interface ProductSpecFormProps {
  products: { id: string; name: string }[];
  parameters: { id: string; name: string; unit?: string }[];
  onSubmit?: (values: ProductSpecFormValues) => void | Promise<void>;
}

export function ProductSpecForm({ products, parameters, onSubmit }: ProductSpecFormProps) {
  const form = useForm<ProductSpecFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      specType: "finished",
    },
  });

  async function handleSubmit(values: ProductSpecFormValues) {
    await onSubmit?.(values);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="productId">Product</Label>
        <Select id="productId" {...form.register("productId")}>
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="parameterId">Parameter</Label>
        <Select id="parameterId" {...form.register("parameterId")}>
          <option value="">Select a parameter</option>
          {parameters.map((parameter) => (
            <option key={parameter.id} value={parameter.id}>
              {parameter.name}
              {parameter.unit ? ` (${parameter.unit})` : ""}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="specType">Specification Type</Label>
        <Select id="specType" {...form.register("specType")}>
          <option value="raw_material">Raw Material</option>
          <option value="intermediate">Intermediate</option>
          <option value="finished">Finished</option>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="minValue">Min</Label>
          <Input id="minValue" {...form.register("minValue")} placeholder="Min" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="targetValue">Target</Label>
          <Input id="targetValue" {...form.register("targetValue")} placeholder="Target" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="maxValue">Max</Label>
          <Input id="maxValue" {...form.register("maxValue")} placeholder="Max" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="toleranceType">Tolerance Type</Label>
        <Input id="toleranceType" {...form.register("toleranceType")} placeholder="e.g. +/-" />
      </div>
      <Button type="submit" className="justify-self-start">
        Save Specification
      </Button>
    </form>
  );
}
