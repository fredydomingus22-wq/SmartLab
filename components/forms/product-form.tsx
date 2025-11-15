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
  code: z.string().min(2),
  type: z.enum(["raw_related", "intermediate", "finished"]),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type ProductFormValues = z.infer<typeof schema>;

interface ProductFormProps {
  onSubmit?: (values: ProductFormValues) => void | Promise<void>;
  defaultValues?: Partial<ProductFormValues>;
}

export function ProductForm({ onSubmit, defaultValues }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      type: "finished",
      status: "active",
      ...defaultValues,
    },
  });

  async function handleSubmit(values: ProductFormValues) {
    await onSubmit?.(values);
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...form.register("name")} placeholder="e.g. Orange Soda" />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="code">Product Code</Label>
        <Input id="code" {...form.register("code")} placeholder="e.g. PROD-001" />
        {form.formState.errors.code && (
          <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Product Type</Label>
        <Select id="type" {...form.register("type")}> 
          <option value="raw_related">Raw Related</option>
          <option value="intermediate">Intermediate</option>
          <option value="finished">Finished</option>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select id="status" {...form.register("status")}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
      <Button type="submit" className="justify-self-start">
        Save Product
      </Button>
    </form>
  );
}
