"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  parameter_id: z.string().uuid("Select a parameter"),
  min_value: z.union([z.coerce.number(), z.nan()]).optional(),
  target_value: z.union([z.coerce.number(), z.nan()]).optional(),
  max_value: z.union([z.coerce.number(), z.nan()]).optional(),
  order_index: z.coerce.number().int().min(0).default(0),
  required: z.boolean().default(true),
});

export type ProductParameterFormValues = z.infer<typeof schema>;

interface ProductParameterFormProps {
  onSubmit?: (values: ProductParameterFormValues) => Promise<void> | void;
  parameters: { id: string; name: string; unit: string }[];
  submitLabel?: string;
}

export function ProductParameterForm({ onSubmit, parameters, submitLabel }: ProductParameterFormProps) {
  const form = useForm<ProductParameterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      order_index: 0,
      required: true,
    },
  });

  async function handleSubmit(values: ProductParameterFormValues) {
    const payload = {
      ...values,
      min_value: Number.isNaN(values.min_value as number) ? null : values.min_value,
      target_value: Number.isNaN(values.target_value as number) ? null : values.target_value,
      max_value: Number.isNaN(values.max_value as number) ? null : values.max_value,
    };
    await onSubmit?.(payload as ProductParameterFormValues);
    form.reset({ order_index: 0, required: true });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="parameter_id">Parameter</Label>
        <Select id="parameter_id" {...form.register("parameter_id")}>
          <option value="">Select parameter</option>
          {parameters.map((parameter) => (
            <option key={parameter.id} value={parameter.id}>
              {parameter.name} ({parameter.unit})
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="min_value">Min</Label>
          <Input id="min_value" type="number" step="any" {...form.register("min_value")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="target_value">Target</Label>
          <Input id="target_value" type="number" step="any" {...form.register("target_value")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="max_value">Max</Label>
          <Input id="max_value" type="number" step="any" {...form.register("max_value")} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid gap-2">
          <Label htmlFor="order_index">Order</Label>
          <Input id="order_index" type="number" {...form.register("order_index", { valueAsNumber: true })} />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={form.watch("required")}
            onChange={(event) => form.setValue("required", event.target.checked)}
          />
          Required
        </label>
      </div>
      <Button type="submit" className="justify-self-start">
        {submitLabel ?? "Link Parameter"}
      </Button>
    </form>
  );
}
