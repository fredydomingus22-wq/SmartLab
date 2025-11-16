import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  description: string;
  trend?: string;
  icon?: LucideIcon;
}

export function KpiCard({ label, value, description, trend, icon: Icon }: KpiCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-white shadow-[0_20px_70px_rgba(4,7,18,0.65)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{label}</p>
          <p className="text-3xl font-semibold">{value}</p>
        </div>
        {Icon ? <Icon className="h-6 w-6 text-white/50" /> : null}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-white/70">
        <span>{description}</span>
        {trend ? <span className="text-white">{trend}</span> : null}
      </div>
    </div>
  );
}
