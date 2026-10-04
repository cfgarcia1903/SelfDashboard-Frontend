"use client";

import dynamic from "next/dynamic";
import type { TimelinePoint } from "@/lib/transformers";
import { formatCurrency, formatDate } from "@/lib/formatters";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function EtoroTimeline({ points, currency }: { points: TimelinePoint[]; currency: string }) {
  const option = {
    animation: true,
    legend: { top: 0, textStyle: { color: "#a9b8b2" } },
    grid: { top: 40, right: 24, bottom: 34, left: 82, containLabel: true },
    tooltip: { trigger: "axis", backgroundColor: "#17221f", borderColor: "#2b3d37", textStyle: { color: "#f3f7f4" }, formatter: (params: Array<{ axisValue: string; seriesName: string; value: number | null }>) => { const values = Object.fromEntries(params.map((item) => [item.seriesName, item.value])); return `${formatDate(params[0]?.axisValue)}<br/>Balance: <strong>${formatCurrency(values.Balance, currency)}</strong><br/>Depósitos acumulados: <strong>${formatCurrency(values.Depósitos, currency)}</strong><br/>Diferencia: <strong>${formatCurrency(values.Diferencia, currency)}</strong>`; } },
    xAxis: { type: "category", boundaryGap: false, data: points.map((point) => point.date), axisLabel: { color: "#82938d", hideOverlap: true }, axisLine: { lineStyle: { color: "#2b3d37" } } },
    yAxis: { type: "value", scale: true, axisLabel: { color: "#82938d", formatter: (value: number) => Number(value).toLocaleString("es-ES", { maximumFractionDigits: 0 }) }, splitLine: { lineStyle: { color: "#22322d" } } },
    series: [{ name: "Balance", type: "line", smooth: true, showSymbol: points.length < 12, data: points.map((point) => point.balance), lineStyle: { width: 3, color: "#8ee6b5" }, itemStyle: { color: "#8ee6b5" } }, { name: "Depósitos", type: "line", step: "end", showSymbol: points.length < 12, data: points.map((point) => point.deposited), lineStyle: { width: 2, type: "dashed", color: "#f2b880" }, itemStyle: { color: "#f2b880" } }, { name: "Diferencia", type: "line", smooth: true, showSymbol: points.length < 12, data: points.map((point) => point.difference), lineStyle: { width: 2, color: "#83b8ff" }, itemStyle: { color: "#83b8ff" } }]
  };
  return <div className="chart-frame chart-frame-tall" aria-label="Evolución de balance y depósitos">{points.length > 0 ? <ReactECharts option={option} style={{ height: "100%", width: "100%" }} opts={{ renderer: "svg" }} /> : <p className="chart-empty">No hay información disponible para este período.</p>}</div>;
}
