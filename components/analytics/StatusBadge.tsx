
// components/analytics/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'pending' | 'in_analysis' | 'validated' | 'rejected' | 'approved' | 'failed' | 'deviation' | 'ok' | 'overdue' | 'out_of_service';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusMap = {
    pending: { label: "Pendente", variant: "secondary" },
    in_analysis: { label: "Em Análise", variant: "warning" },
    validated: { label: "Validado", variant: "success" },
    rejected: { label: "Rejeitado", variant: "destructive" },
    approved: { label: "Aprovado", variant: "success" },
    failed: { label: "Falhou", variant: "destructive" },
    deviation: { label: "Desvio", variant: "warning" },
    ok: { label: "OK", variant: "success" },
    overdue: { label: "Vencido", variant: "destructive" },
    out_of_service: { label: "Fora de Serviço", variant: "destructive" },
  };

  const { label, variant } = statusMap[status];

  return (
    <Badge variant={variant as any}>{label}</Badge>
  );
}
