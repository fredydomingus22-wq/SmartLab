import * as React from "react";
import { cn } from "@/lib/utils";

export type GlassPanelProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassPanel({ className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-white shadow-[0_25px_80px_rgba(4,7,18,0.55)] backdrop-blur-2xl",
        className
      )}
      {...props}
    />
  );
}
