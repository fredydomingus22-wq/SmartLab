"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  category: z.string().min(1),
  defaultSpecDocs: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type RawMaterialFormValues = z.infer<typeof schema>;

interface RawMaterialFormProps {
  onSubmit?: (values: RawMaterialFormValues) => void | Promise<void>;
  defaultValues?: Partial<RawMaterialFormValues>;
}

export function RawMaterialForm({ onSubmit, defaultValues }: RawMaterialFormProps) {
  const form = useForm<RawMaterialFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      category: "",
      defaultSpecDocs: "",
      status: "active",
      ...defaultValues,
    },
  });

  async function handleSubmit(values: RawMaterialFormValues) {
    await onSubmit?.(values);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Raw Material Name</Label>
        <Input id="name" {...form.register("name")} placeholder="e.g. Sugar" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="code">Code</Label>
        <Input id="code" {...form.register("code")} placeholder="e.g. RM-001" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" {...form.register("category")} placeholder="e.g. Sweetener" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="defaultSpecDocs">Default Specs</Label>
        <Input id="defaultSpecDocs" {...form.register("defaultSpecDocs")} placeholder="URL or document reference" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select id="status" {...form.register("status")}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
      <Button type="submit" className="justify-self-start">
        Save Raw Material
      </Button>
    </form>
  );
}
