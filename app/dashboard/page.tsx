"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/contexts/i18n-context";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const kpiData = [
  { title: "Lotes Liberados (24h)", value: "48", trend: "+6%" },
  { title: "NCs Críticas", value: "3", trend: "-1" },
  { title: "Precisão PCC", value: "98.4%", trend: "flat" },
  { title: "Turnaround do Lab", value: "42 min", trend: "up" },
];

const processData = [
  { time: "00:00", value: 11.8 }, { time: "02:00", value: 11.9 }, { time: "04:00", value: 11.85 },
  { time: "06:00", value: 12.0 }, { time: "08:00", value: 12.1 }, { time: "10:00", value: 11.95 },
];

const recentLots = [
    { code: "PL-240915-01", product: "Cola Zero", status: "Liberado", risk: "low" },
    { code: "PL-240915-04", product: "Guaraná", status: "Em Análise", risk: "medium" },
    { code: "PL-240915-11", product: "Chá Pêssego", status: "Bloqueado", risk: "high" },
];

export default function DashboardPage() {
  const { t } = useI18n();
  const [timeframe, setTimeframe] = useState("24h");
  const [parameter, setParameter] = useState("brix");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">{t('dashboard_title')}</h1>
        <p className="text-slate-400">{t('welcome_message')} User!</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map(kpi => (
          <Card key={kpi.title} className="border-slate-900 bg-slate-950/70">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-400">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{kpi.value}</p>
              <p className="text-xs text-slate-500">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-900 bg-slate-950/70">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Janela de Processo</CardTitle>
              <CardDescription>Visualização do parâmetro {parameter} nas últimas {timeframe}.</CardDescription>
            </div>
            <Tabs defaultValue="brix" onValueChange={(value) => setParameter(value)}>
                <TabsList><TabsTrigger value="brix">Brix</TabsTrigger><TabsTrigger value="ph">pH</TabsTrigger></TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/70">
            <CardHeader><CardTitle>Top 3 Analistas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center"><p>L. Pereira</p><Badge>48 análises</Badge></div>
                <div className="flex justify-between items-center"><p>F. Santos</p><Badge>44 análises</Badge></div>
                <div className="flex justify-between items-center"><p>C. Braga</p><Badge>41 análises</Badge></div>
            </CardContent>
        </Card>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader><CardTitle>Lotes Recentes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Lote</TableHead><TableHead>Produto</TableHead><TableHead>Estado</TableHead><TableHead>Risco</TableHead></TableRow></TableHeader>
            <TableBody>
              {recentLots.map(lot => (
                <TableRow key={lot.code}>
                  <TableCell>{lot.code}</TableCell>
                  <TableCell>{lot.product}</TableCell>
                  <TableCell><Badge variant={lot.status === 'Liberado' ? 'success' : 'warning'}>{lot.status}</Badge></TableCell>
                  <TableCell><Badge variant={lot.risk === 'low' ? 'success' : lot.risk === 'medium' ? 'warning' : 'danger'}>{lot.risk}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
