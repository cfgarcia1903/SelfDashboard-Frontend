"use client";

import dynamic from "next/dynamic";
import { formatCurrency } from "@/lib/formatters";
import type { PortfolioComposition } from "@/lib/calculations/portfolio";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function PortfolioCompositionChart({ composition, currency }: { composition: PortfolioComposition; currency: string }) {
  const parts = [{ name: "Invertido", value: composition.invested, color: "#8ee6b5" }, { name: "Cash reservado", value: composition.reservedCash, color: "#f2b880" }, { name: "Cash disponible", value: composition.availableCash, color: "#83b8ff" }];
  const option = { tooltip: { trigger: "item", formatter: (item: { name: string; value: number; percent: number }) => `${item.name}<br/><strong>${formatCurrency(item.value, currency)}</strong> · ${item.percent.toFixed(1)}%` }, series: [{ type: "pie", radius: ["58%", "78%"], avoidLabelOverlap: true, label: { show: false }, data: parts.map((part) => ({ name: part.name, value: part.value, itemStyle: { color: part.color } })) }] };
  return <div className="composition-layout"><div className="donut-wrap"><ReactECharts option={option} style={{ height: "100%", width: "100%" }} opts={{ renderer: "svg" }} /><div className="donut-center"><strong>{formatCurrency(composition.total, currency)}</strong><span>Total</span></div></div><div className="composition-legend">{parts.map((part) => <div className="legend-row" key={part.name}><span className="legend-name"><i style={{ backgroundColor: part.color }} />{part.name}</span><strong>{formatCurrency(part.value, currency)}</strong></div>)}{Math.abs(composition.discrepancy) > 0.01 ? <p className="discrepancy-note">La suma difiere del balance en {formatCurrency(composition.discrepancy, currency)}.</p> : null}</div></div>;
}
