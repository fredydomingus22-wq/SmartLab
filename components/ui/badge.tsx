import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/40",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/40",
  danger: "text-red-400 bg-red-500/10 border-red-500/40",
  neutral: "text-slate-300 bg-slate-800 border-slate-700",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
