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
  category: z.string().min(1),
  line: z.string().min(1),
  type: z.enum(["intermediate", "final"]),
  active: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof schema>;

interface ProductFormProps {
  onSubmit?: (values: ProductFormValues) => void | Promise<void>;
  defaultValues?: Partial<ProductFormValues>;
  submitLabel?: string;
}

export function ProductForm({ onSubmit, defaultValues, submitLabel }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      category: "",
      line: "",
      type: "final",
      active: true,
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
        <Label htmlFor="category">Category</Label>
        <Input id="category" {...form.register("category")} placeholder="e.g. Soda" />
        {form.formState.errors.category && (
          <p className="text-sm text-destructive">
            {form.formState.errors.category.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="line">Production Line</Label>
        <Input id="line" {...form.register("line")} placeholder="e.g. Line 1" />
        {form.formState.errors.line && (
          <p className="text-sm text-destructive">
            {form.formState.errors.line.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Product Type</Label>
        <Select id="type" {...form.register("type")}>
          <option value="intermediate">Intermediate</option>
          <option value="final">Final</option>
        </Select>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={form.watch("active")}
          onChange={(event) => form.setValue("active", event.target.checked)}
        />
        Active
      </label>
      <Button type="submit" className="justify-self-start">
        {submitLabel ?? "Save Product"}
      </Button>
    </form>
  );
}
