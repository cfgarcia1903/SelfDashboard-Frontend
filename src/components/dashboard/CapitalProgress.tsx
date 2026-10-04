import { Triangle } from "lucide-react";
import { calculateCapitalProgress } from "@/lib/calculations/capitalProgress";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

export function CapitalProgress({ deposited, balance, currency }: { deposited: number | null; balance: number | null; currency: string }) {
  const progress = calculateCapitalProgress({ deposited, balance });
  const positive = progress.difference !== null && progress.difference > 0;
  const negative = progress.difference !== null && progress.difference < 0;
  const comparisonTone = positive ? "positive" : negative ? "negative" : "neutral";
  const comparisonLabel = positive ? "Balance por encima" : negative ? "Balance por debajo" : progress.difference === 0 ? "Balance igual" : "Comparación no disponible";
  return <section className="progress-panel"><div className="section-heading"><div><p className="eyebrow">Capital depositado</p><h2>Referencia de financiación</h2></div></div><div className="progress-values"><div><span>Depositado</span><strong>{formatCurrency(progress.deposited, currency)}</strong></div><div><span>Balance actual</span><strong>{formatCurrency(progress.balance, currency)}</strong></div></div><div className={`capital-comparison capital-comparison-${comparisonTone}`} aria-label={`${comparisonLabel}. Diferencia absoluta: ${progress.difference === null ? "no disponible" : formatCurrency(progress.difference, currency)}. Porcentaje: ${formatPercentage(progress.returnPercentage)}`}><Triangle size={25} fill="currentColor" aria-hidden="true" className={negative ? "is-down" : ""} /><div><strong>{comparisonLabel}</strong><span>Diferencia: {progress.difference === null ? "No disponible" : formatCurrency(progress.difference, currency)}</span><span>Porcentaje: {formatPercentage(progress.returnPercentage)}</span></div></div><p className="muted-note">La diferencia no se presenta como P&amp;L: el contrato no expone retiradas, comisiones ni otros movimientos.</p></section>;
}
