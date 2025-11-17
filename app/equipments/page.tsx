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

const equipments = [
  {
    id: "EQP-001",
    name: "Balança Analítica",
    department: "Laboratório",
    calibrationStatus: "Calibrado",
    nextCalibration: "2025-03-15",
  },
  {
    id: "EQP-002",
    name: "pHmetro de Bancada",
    department: "Laboratório",
    calibrationStatus: "Vencido",
    nextCalibration: "2024-11-10",
  },
  {
    id: "EQP-003",
    name: "Termômetro Digital",
    department: "Produção",
    calibrationStatus: "Calibrado",
    nextCalibration: "2025-01-20",
  },
];

export default function EquipmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Equipamentos & Calibração</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Gestão de Equipamentos</h1>
          <p className="text-slate-400">Consulte o estado de calibração e registe novos equipamentos.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/equipments/create">Registar Novo Equipamento</Link>
        </Button>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Lista de Equipamentos</CardTitle>
          <CardDescription>Equipamentos registados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome do Equipamento</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Próxima Calibração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipments.map((equipment) => (
                <TableRow key={equipment.id}>
                  <TableCell className="font-semibold text-white">{equipment.id}</TableCell>
                  <TableCell className="text-slate-300">{equipment.name}</TableCell>
                  <TableCell className="text-slate-400">{equipment.department}</TableCell>
                  <TableCell>{equipment.nextCalibration}</TableCell>
                  <TableCell>
                    <Badge
                      variant={equipment.calibrationStatus === "Calibrado" ? "success" : "danger"}
                    >
                      {equipment.calibrationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/equipments/${equipment.id}/calibration/create`}>Registar Calibração</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
