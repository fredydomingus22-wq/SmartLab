
// lib/analytics/index.ts
// Placeholder functions for the Data Intelligence module.
// These will be replaced with real calculations in a future task.

export function calcSPC(data: any) {
  return {
    xBar: {
      ucl: 105,
      cl: 100,
      lcl: 95,
      points: [98, 102, 100, 101, 99, 103, 104, 98, 97, 102],
    },
    imr: {
      ucl: 5,
      cl: 2,
      points: [4, 2, 1, 2, 4, 1, 6, 1, 5],
    },
    histogram: [
      { range: "95-97", count: 2 },
      { range: "98-100", count: 4 },
      { range: "101-103", count: 3 },
      { range: "104-105", count: 1 },
    ],
  };
}

export function calcKPIs(filters: any) {
  return [
    { name: "Total Análises 24h", value: "1,204", change: "+5%" },
    { name: "% Conformidade (RFT)", value: "98.2%", change: "-0.1%" },
    { name: "Lotes Liberados vs Bloqueados", value: "32 / 2", change: "" },
    { name: "Desvios Críticos", value: "3", change: "+1" },
    { name: "Custo da Não-Qualidade", value: "€1,500", change: "+€200" },
    { name: "Equipamentos Calibrados vs Vencidos", value: "48 / 2", change: "" },
  ];
}

export function calcPareto(data: any) {
  return [
    { cause: "Contaminação", count: 45, cumulative: 45 },
    { cause: "Fora de Espec.", count: 25, cumulative: 70 },
    { cause: "Erro de Amostragem", count: 15, cumulative: 85 },
    { cause: "Falha de Equipamento", count: 10, cumulative: 95 },
    { cause: "Outros", count: 5, cumulative: 100 },
  ];
}

export function calcHeatmap(data: any) {
  return [
    { line: "Linha 1", parameter: "Brix", value: 0.95 },
    { line: "Linha 1", parameter: "pH", value: 0.88 },
    { line: "Linha 2", parameter: "Brix", value: 0.91 },
    { line: "Linha 2", parameter: "pH", value: 0.93 },
  ];
}

export function calcCorrelations(data: any) {
  return [
    { x: 3.5, y: 4.2 },
    { x: 3.7, y: 4.5 },
    { x: 3.6, y: 4.1 },
    { x: 3.9, y: 4.8 },
  ];
}
