import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const modules = [
  {
    key: "prp",
    title: "PRP",
    description: "Programas de pré-requisitos – saneamento, EPIs e infraestrutura.",
    cta: "Registrar PRP",
    dataset: [
      {
        id: "PRP-01",
        title: "Higienização CIP",
        frequency: "Diário",
        owner: "Saneamento",
        status: "Ativo",
        variant: "success" as const,
      },
      {
        id: "PRP-04",
        title: "Controle de pragas",
        frequency: "Semanal",
        owner: "Facilities",
        status: "Atenção",
        variant: "warning" as const,
      },
      {
        id: "PRP-07",
        title: "Calibração balanças",
        frequency: "Mensal",
        owner: "Manutenção",
        status: "Revisar",
        variant: "danger" as const,
      },
    ],
  },
  {
    key: "oprp",
    title: "OPRP",
    description: "Controles operacionais vinculados ao processo de mistura e envase.",
    cta: "Adicionar OPRP",
    dataset: [
      {
        id: "OPRP-02",
        title: "Temperatura xarope",
        frequency: "Hora em hora",
        owner: "PCP",
        status: "Dentro da faixa",
        variant: "success" as const,
      },
      {
        id: "OPRP-05",
        title: "Filtros de água",
        frequency: "A cada turno",
        owner: "Utilidades",
        status: "Inspeção pendente",
        variant: "warning" as const,
      },
    ],
  },
  {
    key: "pcc",
    title: "PCC",
    description: "Pontos críticos monitorados com limites rígidos e reação imediata.",
    cta: "Registrar PCC",
    dataset: [
      {
        id: "PCC-10",
        title: "Pasteurização – Temp mínima",
        frequency: "Lote",
        owner: "Qualidade",
        status: "Em revisão",
        variant: "warning" as const,
      },
      {
        id: "PCC-12",
        title: "CO₂ final",
        frequency: "100% lotes",
        owner: "Laboratório",
        status: "Conforme",
        variant: "success" as const,
      },
      {
        id: "PCC-14",
        title: "Metal detector",
        frequency: "Continuamente",
        owner: "Produção",
        status: "Alerta",
        variant: "danger" as const,
      },
    ],
  },
];

export default function FoodSafetyPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Food Safety</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Governança PRP · OPRP · PCC</h1>
          <p className="text-slate-400">
            Superfície única para monitorar pré-requisitos, controles operacionais e pontos críticos.
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/food-safety/prp">Abrir painel detalhado</Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {modules.map((module) => (
          <Card
            key={module.key}
            className="border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-xl shadow-slate-950/30"
          >
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/food-safety/${module.key}`}>{module.cta}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {module.dataset.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-semibold text-white">{entry.id}</TableCell>
                      <TableCell className="text-slate-300">{entry.title}</TableCell>
                      <TableCell className="text-slate-400">{entry.frequency}</TableCell>
                      <TableCell className="text-slate-400">{entry.owner}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={entry.variant}>{entry.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
