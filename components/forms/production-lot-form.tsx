"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const schema = z.object({
  productionLotCode: z.string().min(2),
  productId: z.string(),
  lineId: z.string().optional(),
  shiftId: z.string().optional(),
  status: z.enum(["planned", "in_progress", "completed"]).default("planned"),
});

export type ProductionLotFormValues = z.infer<typeof schema>;

interface ProductionLotFormProps {
  products: { id: string; name: string }[];
  lines: { id: string; name: string }[];
  shifts: { id: string; name: string }[];
  onSubmit?: (values: ProductionLotFormValues) => void | Promise<void>;
}

export function ProductionLotForm({ products, lines, shifts, onSubmit }: ProductionLotFormProps) {
  const form = useForm<ProductionLotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "planned",
    },
  });

  async function handleSubmit(values: ProductionLotFormValues) {
    await onSubmit?.(values);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="productionLotCode">Production Lot Code</Label>
        <Input id="productionLotCode" {...form.register("productionLotCode")} placeholder="e.g. LOT-2024-001" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="productId">Product</Label>
        <Select id="productId" {...form.register("productId")}>
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lineId">Line</Label>
        <Select id="lineId" {...form.register("lineId")}>
          <option value="">Select line</option>
          {lines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="shiftId">Shift</Label>
        <Select id="shiftId" {...form.register("shiftId")}>
          <option value="">Select shift</option>
          {shifts.map((shift) => (
            <option key={shift.id} value={shift.id}>
              {shift.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select id="status" {...form.register("status")}>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </div>
      <Button type="submit" className="justify-self-start">
        Save Production Lot
      </Button>
    </form>
  );
}
