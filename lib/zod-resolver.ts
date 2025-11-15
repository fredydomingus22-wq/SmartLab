import { Resolver } from "react-hook-form";
import { z } from "zod";

type ResolverResult<T> = {
  values: T | {};
  errors: Record<string, any>;
};

function buildErrors(issues: z.ZodIssue[]): Record<string, any> {
  return issues.reduce<Record<string, any>>((acc, issue) => {
    const path = issue.path.join(".");
    acc[path] = {
      type: issue.code,
      message: issue.message,
    };
    return acc;
  }, {});
}

export function zodResolver<TSchema extends z.ZodTypeAny>(
  schema: TSchema
): Resolver<z.infer<TSchema>> {
  return async (values) => {
    const parsed = schema.safeParse(values);

    if (parsed.success) {
      return { values: parsed.data, errors: {} } as ResolverResult<
        z.infer<TSchema>
      >;
    }

    return {
      values: {},
      errors: buildErrors(parsed.error.issues),
    } as ResolverResult<z.infer<TSchema>>;
  };
}
