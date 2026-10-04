"use client";

import type { SnapshotPeriod } from "@/types/api";

export type Period = SnapshotPeriod;

const periods: { value: Period; label: string }[] = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1S" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1A" }
];

export function PeriodSelector({ value, onChange }: { value: Period; onChange: (value: Period) => void }) {
  return <div className="period-selector" role="group" aria-label="Período del gráfico">{periods.map((period) => <button key={period.value} className={value === period.value ? "period-button is-active" : "period-button"} aria-pressed={value === period.value} onClick={() => onChange(period.value)}>{period.label}</button>)}</div>;
}
