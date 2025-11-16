"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductionLotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "planned",
    },
  });

  async function handleSubmit(values: ProductionLotFormValues) {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Default: call API endpoint
        const resp = await fetch("/api/production-lots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            production_lot_code: values.productionLotCode,
            product_id: values.productId,
            line_id: values.lineId || null,
            shift_id: values.shiftId || null,
          }),
        });

        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}));
          setError(body?.error || "Failed to create production lot");
          setLoading(false);
          return;
        }

        setSuccess(true);
        setTimeout(() => {
          router.push("/production-lots");
        }, 1000);
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
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
      {error && <div className="text-destructive text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Production lot created successfully! Redirecting...</div>}
      <Button type="submit" disabled={loading} className="justify-self-start">
        {loading ? "Creating..." : "Save Production Lot"}
      </Button>
    </form>
  );
}
