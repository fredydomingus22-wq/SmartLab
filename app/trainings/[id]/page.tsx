import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const trainingCatalog = [
  {
    id: "TR-2409-01",
    title: "HACCP – Refresh 2024",
    status: "active",
    instructor: "M. Costa",
    scheduledAt: "2024-09-18T08:00:00Z",
    validityMonths: 12,
    location: "Auditório QA",
    summary: "Reciclagem anual de HACCP com foco em PCC e auditorias FSSC.",
    participants: [
      { name: "L. Pereira", role: "Lab Tech", completion: "Concluído" },
      { name: "F. Santos", role: "Supervisor", completion: "Em progresso" },
      { name: "S. Nogueira", role: "Operador", completion: "Agendado" },
    ],
    history: [
      { timestamp: "2024-09-05 09:10", event: "Checklist enviado aos participantes", owner: "QA Manager" },
      { timestamp: "2024-09-04 15:20", event: "Material atualizado no portal", owner: "Food Safety" },
      { timestamp: "2024-08-29 11:00", event: "Turma confirmada", owner: "Recursos Humanos" },
    ],
  },
  {
    id: "TR-2409-02",
    title: "Microbiologia Avançada",
    status: "expiring",
    instructor: "F. Santos",
    scheduledAt: "2024-09-25T13:30:00Z",
    validityMonths: 24,
    location: "Laboratório Central",
    summary: "Treinamento voltado a técnicas de micro para matérias-primas.",
    participants: [
      { name: "C. Braga", role: "Analista", completion: "Concluído" },
      { name: "M. Ramos", role: "Analista", completion: "Agendado" },
    ],
    history: [
      { timestamp: "2024-09-07 14:10", event: "Plano de aula revisado", owner: "Líder Laboratório" },
      { timestamp: "2024-08-30 10:00", event: "Slots liberados para inscrição", owner: "RH" },
    ],
  },
];

const statusCopy: Record<
  (typeof trainingCatalog)[number]["status"],
  { label: string; variant: "success" | "warning" | "danger" }
> = {
  active: { label: "Ativo", variant: "success" },
  expiring: { label: "Vence em breve", variant: "warning" },
  overdue: { label: "Vencido", variant: "danger" },
};

interface TrainingPageProps {
  params: { id: string };
}

export default function TrainingDetailPage({ params }: TrainingPageProps) {
  const training = trainingCatalog.find((item) => item.id === params.id);

  if (!training) {
    notFound();
  }

  const status = statusCopy[training.status];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Treinamentos · {training.id}</p>
        <h1 className="text-3xl font-semibold text-white">{training.title}</h1>
        <p className="text-slate-400">{training.summary}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-900 bg-slate-950/70">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Metadados</CardTitle>
              <CardDescription>Informações principais da sessão</CardDescription>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Instrutor</p>
              <p className="text-lg text-white">{training.instructor}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Local</p>
              <p className="text-lg text-white">{training.location}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Data</p>
              <p className="text-lg text-white">
                {new Date(training.scheduledAt).toLocaleString("pt-BR", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Validade</p>
              <p className="text-lg text-white">{training.validityMonths} meses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Status geral</CardTitle>
            <CardDescription>Resumo de execução</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <div className="rounded-xl border border-slate-900/70 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Participantes</p>
              <p className="text-2xl font-semibold text-white">{training.participants.length}</p>
              <p className="text-xs text-slate-500">Associados ao programa</p>
            </div>
            <div className="rounded-xl border border-slate-900/70 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Próxima ação</p>
              <p className="text-base text-white">
                {status.variant === "danger" ? "Agendar reciclagem" : "Monitorar presença"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-900 bg-slate-950/60">
        <CardHeader>
          <CardTitle>Participantes</CardTitle>
          <CardDescription>Status de conclusão</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Conclusão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {training.participants.map((participant) => (
                <TableRow key={participant.name}>
                  <TableCell className="font-medium text-white">{participant.name}</TableCell>
                  <TableCell>{participant.role}</TableCell>
                  <TableCell className="text-slate-300">{participant.completion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-slate-900 bg-slate-950/60">
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Eventos recentes do treinamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {training.history.map((item) => (
              <div key={item.timestamp} className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{item.event}</p>
                  <p className="text-xs text-slate-400">{item.timestamp} · {item.owner}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
