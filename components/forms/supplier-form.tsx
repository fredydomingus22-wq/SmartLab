"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2),
  contactInfo: z.string().optional(),
  certification: z.string().optional(),
  riskLevel: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["approved", "blocked", "pending"]).default("approved"),
});

export type SupplierFormValues = z.infer<typeof schema>;

interface SupplierFormProps {
  onSubmit?: (values: SupplierFormValues) => void | Promise<void>;
  defaultValues?: Partial<SupplierFormValues>;
}

export function SupplierForm({ onSubmit, defaultValues }: SupplierFormProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      contactInfo: "",
      certification: "",
      riskLevel: "medium",
      status: "approved",
      ...defaultValues,
    },
  });

  async function handleSubmit(values: SupplierFormValues) {
    await onSubmit?.(values);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Supplier Name</Label>
        <Input id="name" {...form.register("name")} placeholder="e.g. Citrus Harvest" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contactInfo">Contact Information</Label>
        <Input id="contactInfo" {...form.register("contactInfo")} placeholder="Email, phone, etc." />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="certification">Certifications</Label>
        <Input id="certification" {...form.register("certification")} placeholder="e.g. ISO 22000" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="riskLevel">Risk Level</Label>
        <Select id="riskLevel" {...form.register("riskLevel")}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select id="status" {...form.register("status")}>
          <option value="approved">Approved</option>
          <option value="blocked">Blocked</option>
          <option value="pending">Pending</option>
        </Select>
      </div>
      <Button type="submit" className="justify-self-start">
        Save Supplier
      </Button>
    </form>
  );
}
