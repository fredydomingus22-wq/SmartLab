import { z } from "zod";

export const productPayloadSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name is required"),
  code: z.string().min(2, "Code is required"),
  type: z.enum(["intermediate", "final"]),
  category: z.string().min(1, "Category is required"),
  line: z.string().min(1, "Production line is required"),
  active: z.boolean().default(true),
});

export type ProductPayload = z.infer<typeof productPayloadSchema>;

export const parameterPayloadSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Parameter name is required"),
  unit: z.string().min(1, "Unit is required"),
  input_type: z.enum(["number", "text", "select", "boolean"]),
});

export type ParameterPayload = z.infer<typeof parameterPayloadSchema>;

export const productParameterPayloadSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  parameter_id: z.string().uuid(),
  min_value: z.union([z.coerce.number(), z.null()]).optional(),
  target_value: z.union([z.coerce.number(), z.null()]).optional(),
  max_value: z.union([z.coerce.number(), z.null()]).optional(),
  order_index: z.coerce.number().int().min(0).default(0),
  required: z.boolean().default(true),
});

export type ProductParameterPayload = z.infer<typeof productParameterPayloadSchema>;
