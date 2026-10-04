import type { ReactNode } from "react";

export function MetricCard({ label, value, detail, tone = "neutral", icon }: { label: string; value: string; detail?: string; tone?: "neutral" | "positive" | "negative"; icon?: ReactNode }) {
  return <section className="metric-card"><div className="metric-label">{icon}<span>{label}</span></div><strong className={`metric-value tone-${tone}`}>{value}</strong>{detail ? <p className="metric-detail">{detail}</p> : null}</section>;
}
