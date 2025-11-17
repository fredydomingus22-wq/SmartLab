import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/charts/trend-chart";

const kpiCards = [
  { title: "NC Abertas", value: 12, description: "Em todas as fábricas" },
  { title: "Lotes em Quarentena", value: 5, description: "Aguardando liberação de QA" },
  { title: "Desvios de PCC", value: 1, description: "Últimos 7 dias" },
  { title: "Taxa de OOS", value: "2.4%", description: "Acumulado no mês" },
];

const trendData = [
  { date: "Semana 1", co2: 5.8, brix: 11.9, ph: 3.2 },
  { date: "Semana 2", co2: 5.9, brix: 12.1, ph: 3.15 },
  { date: "Semana 3", co2: 6.1, brix: 11.8, ph: 3.22 },
  { date: "Semana 4", co2: 5.7, brix: 12.0, ph: 3.1 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Central de Comando SmartLab</h1>
        <p className="text-muted-foreground">Monitorize a qualidade, segurança e produção em tempo real.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <CardDescription>{kpi.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Produto Acabado</CardTitle>
          <CardDescription>Monitorize CO₂, Brix e pH por semana</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart
            data={trendData}
            xKey="date"
            series={[
              { name: "CO₂ (g/L)", dataKey: "co2", color: "#0ea5e9" },
              { name: "Brix", dataKey: "brix", color: "#f97316" },
              { name: "pH", dataKey: "ph", color: "#84cc16" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
