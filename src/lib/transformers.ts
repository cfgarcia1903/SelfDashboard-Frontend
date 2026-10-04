import type { AccountBalance, Currency, Deposit, EtoroAccountSnapshot, EtoroAccountSummary } from "@/types/api";

export interface TimelinePoint {
  date: string;
  balance: number | null;
  deposited: number | null;
  difference: number | null;
}

export function toAccountBalance(summary: EtoroAccountSummary): AccountBalance {
  return {
    accountId: "etoro",
    accountName: "eToro",
    balance: summary.total_balance,
    timestamp: summary.last_close_date,
    currency: summary.currency
  };
}

function snapshotValue(snapshot: EtoroAccountSnapshot, currency: Currency): number | null {
  const value = currency === "USD" ? snapshot.value_usd : currency === "PEN" ? snapshot.value_pen : null;
  return value !== null && Number.isFinite(value) ? value : null;
}

export function toSnapshotTimeline(snapshots: EtoroAccountSnapshot[], currency: Currency): TimelinePoint[] {
  return [...snapshots].sort((a, b) => a.date.localeCompare(b.date)).map((snapshot) => ({ date: snapshot.date, balance: snapshotValue(snapshot, currency), deposited: null, difference: null }));
}

function depositValue(deposit: Deposit): number | null {
  return Number.isFinite(deposit.amount) ? deposit.amount : null;
}

function dateKey(value: string): string | null {
  const dayMonthYear = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.slice(0, 10));
  const yearMonthDay = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.slice(0, 10));
  const [, day, month, year] = dayMonthYear ?? [];
  const [, isoYear, isoMonth, isoDay] = yearMonthDay ?? [];
  const normalizedYear = year ?? isoYear;
  const normalizedMonth = month ?? isoMonth;
  const normalizedDay = day ?? isoDay;
  if (!normalizedYear || !normalizedMonth || !normalizedDay) return null;
  const parsed = new Date(Date.UTC(Number(normalizedYear), Number(normalizedMonth) - 1, Number(normalizedDay)));
  if (parsed.getUTCFullYear() !== Number(normalizedYear) || parsed.getUTCMonth() !== Number(normalizedMonth) - 1 || parsed.getUTCDate() !== Number(normalizedDay)) return null;
  return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`;
}

export function toEtoroTimeline(snapshots: EtoroAccountSnapshot[], deposits: Deposit[], currency: Currency): TimelinePoint[] {
  const datedSnapshots = snapshots.flatMap((snapshot) => {
    const date = dateKey(snapshot.date);
    return date === null ? [] : [{ snapshot, date }];
  });
  const sortedSnapshots = datedSnapshots.sort((a, b) => a.date.localeCompare(b.date));
  const datedDeposits = deposits.flatMap((deposit) => {
    const date = dateKey(deposit.deposited_at);
    return date === null ? [] : [{ deposit, date }];
  });
  const sortedDeposits = datedDeposits.sort((a, b) => a.date.localeCompare(b.date));
  const hasCurrencyMismatch = sortedDeposits.some(({ deposit }) => depositValue(deposit) !== null && deposit.currency !== currency);
  const dates = [...new Set(sortedSnapshots.map(({ date }) => date))];
  const depositsByDate = new Map<string, number>();
  for (const { deposit, date } of sortedDeposits) {
    const amount = depositValue(deposit);
    if (amount !== null && deposit.currency === currency) {
      depositsByDate.set(date, (depositsByDate.get(date) ?? 0) + amount);
    }
  }

  let accumulated = 0;
  let depositIndex = 0;
  return dates.map((date) => {
    while (depositIndex < sortedDeposits.length && sortedDeposits[depositIndex].date <= date) {
      accumulated += depositsByDate.get(sortedDeposits[depositIndex].date) ?? 0;
      const depositDate = sortedDeposits[depositIndex].date;
      while (depositIndex < sortedDeposits.length && sortedDeposits[depositIndex].date === depositDate) depositIndex += 1;
    }
    const snapshot = sortedSnapshots.find((item) => item.date === date)?.snapshot;
    const balance = snapshot ? snapshotValue(snapshot, currency) : null;
    const deposited = hasCurrencyMismatch ? null : accumulated;
    return { date, balance, deposited, difference: balance !== null && deposited !== null ? balance - deposited : null };
  });
}
