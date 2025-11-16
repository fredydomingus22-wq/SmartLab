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
  unit: z.string().min(1),
  input_type: z.enum(["number", "text", "select", "boolean"]),
});

export type ParameterFormValues = z.infer<typeof schema>;

interface ParameterFormProps {
  onSubmit?: (values: ParameterFormValues) => void | Promise<void>;
  defaultValues?: Partial<ParameterFormValues>;
  submitLabel?: string;
}

export function ParameterForm({ onSubmit, defaultValues, submitLabel }: ParameterFormProps) {
  const form = useForm<ParameterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      unit: "",
      input_type: "number",
      ...defaultValues,
    },
  });

  async function handleSubmit(values: ParameterFormValues) {
    await onSubmit?.(values);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Parameter Name</Label>
        <Input id="name" {...form.register("name")} placeholder="e.g. Brix" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit">Unit</Label>
        <Input id="unit" {...form.register("unit")} placeholder="e.g. %" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="input_type">Input Type</Label>
        <Select id="input_type" {...form.register("input_type")}>
          <option value="number">Number</option>
          <option value="text">Text</option>
          <option value="select">Select</option>
          <option value="boolean">Boolean</option>
        </Select>
      </div>
      <Button type="submit" className="justify-self-start">
        {submitLabel ?? "Save Parameter"}
      </Button>
    </form>
  );
}
