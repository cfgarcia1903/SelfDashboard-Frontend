"use client";

import { useCallback, useEffect, useState } from "react";
import { Database, ShieldCheck } from "lucide-react";
import { etoroService } from "@/services/etoroService";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/formatters";
import { calculatePortfolioComposition } from "@/lib/calculations/portfolio";
import { toEtoroTimeline } from "@/lib/transformers";
import type { AccountSummaryResponse, DepositsResponse, SnapshotsResponse } from "@/types/api";
import { DataSection } from "../dashboard/DataSection";
import { PeriodSelector, type Period } from "../dashboard/PeriodSelector";
import { MetricCard } from "../dashboard/MetricCard";
import { CapitalProgress } from "../dashboard/CapitalProgress";
import { EtoroTimeline } from "../charts/EtoroTimeline";
import { PortfolioCompositionChart } from "../charts/PortfolioCompositionChart";
import { EmptyState, ErrorState, LoadingState } from "../ui/States";

export function EtoroClient() {
  const [summary, setSummary] = useState<AccountSummaryResponse | null>(null);
  const [snapshots, setSnapshots] = useState<SnapshotsResponse | null>(null);
  const [deposits, setDeposits] = useState<DepositsResponse | null>(null);
  const [period, setPeriod] = useState<Period>("1M");
  const [state, setState] = useState<"loading" | "ready" | "partial" | "error">("loading");

  const load = useCallback(async () => {
    setState("loading");
    const results = await Promise.allSettled([etoroService.getSummary(), etoroService.getSnapshots(period), etoroService.getDeposits()]);
    const [summaryResult, snapshotsResult, depositsResult] = results;
    setSummary(summaryResult.status === "fulfilled" ? summaryResult.value : null);
    setSnapshots(snapshotsResult.status === "fulfilled" ? snapshotsResult.value : null);
    setDeposits(depositsResult.status === "fulfilled" ? depositsResult.value : null);
    setState(results.every((result) => result.status === "rejected") ? "error" : results.some((result) => result.status === "rejected") ? "partial" : "ready");
  }, [period]);

  useEffect(() => { void load(); }, [load]);

  if (state === "loading") return <LoadingState label="Cargando eToro" />;
  if (state === "error" || !summary) return <ErrorState onRetry={() => void load()} />;

  const account = summary.account_summary;
  const timeline = snapshots && deposits ? toEtoroTimeline(snapshots.snapshots, deposits.deposits, account.currency) : [];
  const composition = calculatePortfolioComposition(account.total_balance, account.total_cash, account.reserved_cash, account.available_cash);
  const tone = account.change_since_last_close > 0 ? "positive" : account.change_since_last_close < 0 ? "negative" : "neutral";
  return <div className="dashboard-page"><div className="page-intro"><div><p className="eyebrow">Cuenta conectada</p><h1>eToro</h1><p className="lede">Detalle del balance, liquidez y capital registrado.</p></div><div className="secure-indicator"><ShieldCheck size={16} /> Credenciales protegidas en servidor</div></div><section className="hero-grid hero-grid-three"><MetricCard label="Balance total" value={formatCurrency(account.total_balance, account.currency)} detail={`Cierre del ${formatDate(account.last_close_date)}`} /><MetricCard label="Depósitos registrados" value={formatCurrency(account.deposits, account.currency)} detail="Valor entregado por el resumen" /><MetricCard label="Cambio desde cierre" value={formatCurrency(account.change_since_last_close, account.currency)} detail={formatPercentage(account.change_since_last_close_pct)} tone={tone} /></section>{state === "partial" ? <div className="partial-banner"><Database size={16} /> Algunos bloques no están disponibles; mostramos solo los datos entregados por el backend.</div> : null}<DataSection eyebrow="Evolución" title="Balance frente a depósitos acumulados" action={<PeriodSelector value={period} onChange={setPeriod} />}>{timeline.length > 0 ? <EtoroTimeline points={timeline} currency={account.currency} /> : <EmptyState />}</DataSection><div className="two-column"><DataSection eyebrow="Composición" title="Dónde está tu balance"><PortfolioCompositionChart composition={composition} currency={account.currency} /></DataSection><CapitalProgress deposited={account.deposits} balance={account.total_balance} currency={account.currency} /></div><p className="muted-note">El contrato no incluye retiradas, comisiones ni otros movimientos. Por eso la diferencia entre balance y depósitos se muestra como referencia, no como P&amp;L.</p></div>;
}
