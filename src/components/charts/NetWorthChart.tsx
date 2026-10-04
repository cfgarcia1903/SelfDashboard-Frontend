"use client";

import dynamic from "next/dynamic";
import type { TimelinePoint } from "@/lib/transformers";
import { formatCurrency, formatDate } from "@/lib/formatters";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function NetWorthChart({ points, currency }: { points: TimelinePoint[]; currency: string }) {
  const option = {
    animation: true,
    grid: { top: 18, right: 24, bottom: 34, left: 82, containLabel: true },
    tooltip: { trigger: "axis", backgroundColor: "#17221f", borderColor: "#2b3d37", textStyle: { color: "#f3f7f4" }, formatter: (params: Array<{ axisValue: string; value: number | null }>) => `${formatDate(params[0]?.axisValue)}<br/><strong>${formatCurrency(params[0]?.value, currency)}</strong>` },
    xAxis: { type: "category", boundaryGap: false, data: points.map((point) => point.date), axisLabel: { color: "#82938d", hideOverlap: true }, axisLine: { lineStyle: { color: "#2b3d37" } } },
    yAxis: { type: "value", scale: true, axisLabel: { color: "#82938d", formatter: (value: number) => Number(value).toLocaleString("es-ES", { maximumFractionDigits: 0 }) }, splitLine: { lineStyle: { color: "#22322d" } } },
    series: [{ name: "Patrimonio", type: "line", smooth: true, showSymbol: points.length < 12, data: points.map((point) => point.balance), lineStyle: { width: 3, color: "#8ee6b5" }, itemStyle: { color: "#8ee6b5" }, areaStyle: { color: "rgba(142,230,181,0.10)" } }]
  };
  return <div className="chart-frame" aria-label="Evolución histórica del patrimonio">{points.length > 0 ? <ReactECharts option={option} style={{ height: "100%", width: "100%" }} opts={{ renderer: "svg" }} /> : <p className="chart-empty">No hay información disponible para este período.</p>}</div>;
}
