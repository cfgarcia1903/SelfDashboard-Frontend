"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, ArrowUpRight, Landmark } from "lucide-react";
import { dashboardService } from "@/services/dashboardService";
import { getErrorMessage } from "@/lib/api/errors";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { toAccountBalance, toSnapshotTimeline } from "@/lib/transformers";
import type { AccountSummaryResponse, SnapshotsResponse } from "@/types/api";
import { AccountBalanceCard } from "./AccountBalanceCard";
import { MetricCard } from "./MetricCard";
import { PeriodSelector, type Period } from "./PeriodSelector";
import { DataSection } from "./DataSection";
import { LoadingState, EmptyState, ErrorState } from "../ui/States";
import { NetWorthChart } from "../charts/NetWorthChart";

export function DashboardClient() {
  const [summary, setSummary] = useState<AccountSummaryResponse | null>(null);
  const [snapshots, setSnapshots] = useState<SnapshotsResponse | null>(null);
  const [period, setPeriod] = useState<Period>("1M");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  const load = useCallback(async (selectedPeriod: Period = period) => {
    setState("loading");
    setError("");
    try {
      const [summaryResult, snapshotsResult] = await Promise.all([dashboardService.getSummary(), dashboardService.getSnapshots(selectedPeriod)]);
      setSummary(summaryResult);
      setSnapshots(snapshotsResult);
      setState("ready");
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setState("error");
    }
  }, [period]);

  useEffect(() => { void load(period); }, [load, period]);

  if (state === "loading") return <LoadingState label="Cargando tu patrimonio" />;
  if (state === "error" || !summary || !snapshots) return <ErrorState onRetry={() => void load()} />;

  const accountSummary = summary.account_summary;
  const points = toSnapshotTimeline(snapshots.snapshots, accountSummary.currency);
  const account = toAccountBalance(accountSummary);
  const changeTone = accountSummary.change_since_last_close > 0 ? "positive" : accountSummary.change_since_last_close < 0 ? "negative" : "neutral";
  return <div className="dashboard-page"><div className="page-intro"><div><p className="eyebrow">Vista general</p><h1>Tu patrimonio, de un vistazo.</h1><p className="lede">Sigue el valor total y su evolución a través de tus cuentas conectadas.</p></div><div className="live-indicator"><span /> Datos del backend</div></div><section className="hero-grid"><MetricCard label="Patrimonio total" value={formatCurrency(accountSummary.total_balance, accountSummary.currency)} detail={`Cierre del ${accountSummary.last_close_date}`} icon={<Landmark size={18} />} /><MetricCard label="Variación desde el último cierre" value={formatCurrency(accountSummary.change_since_last_close, accountSummary.currency)} detail={formatPercentage(accountSummary.change_since_last_close_pct)} tone={changeTone} icon={<ArrowUpRight size={18} />} /></section><DataSection eyebrow="Evolución" title="Patrimonio histórico" action={<PeriodSelector value={period} onChange={setPeriod} />}>{points.length > 0 ? <NetWorthChart points={points} currency={accountSummary.currency} /> : <EmptyState />}</DataSection><DataSection eyebrow="Cuentas conectadas" title="Balance actual"><div className="account-grid"><AccountBalanceCard account={account} /></div></DataSection>{error ? <p className="sr-only">{error}</p> : null}<div className="contract-note"><Activity size={16} /><span>Los datos se leen exclusivamente del API de SelfDashboard. La evolución depende de los snapshots publicados por el backend.</span></div></div>;
}
