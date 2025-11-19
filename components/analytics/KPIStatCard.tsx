
// components/analytics/KPIStatCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface KPIStatCardProps {
  name: string;
  value: string;
  change?: string;
}

export function KPIStatCard({ name, value, change }: KPIStatCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/70">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {change && (
          <p className="text-xs text-slate-500">{change} from last period</p>
        )}
      </CardContent>
    </Card>
  );
}
