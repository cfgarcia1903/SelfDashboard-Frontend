export type Currency = string;
export type SnapshotPeriod = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

export interface HealthResponse {
  status: "ok";
}

export interface EtoroAccountSnapshot {
  date: string;
  value_usd: number;
  value_pen: number;
}

export interface SnapshotsResponse {
  snapshots: EtoroAccountSnapshot[];
}

export interface EtoroAccountSummary {
  currency: Currency;
  total_balance: number;
  total_cash: number;
  reserved_cash: number;
  available_cash: number;
  deposits: number;
  last_close_date: string;
  last_close_balance: number;
  change_since_last_close: number;
  change_since_last_close_pct: number | null;
}

export interface AccountSummaryResponse {
  account_summary: EtoroAccountSummary;
}

export interface Deposit {
  id: number;
  amount: number;
  currency: Currency;
  deposited_at: string;
  created_at: string | null;
}

export interface EditableDeposit {
  id?: number;
  amount: number;
  currency?: Currency;
  deposited_at: string;
  created_at?: string | null;
}

export interface DepositsResponse {
  deposits: Deposit[];
}

export interface EditDepositsRequest {
  deposits: EditableDeposit[];
}

export interface DeleteDepositsRequest {
  deposit_ids: number[];
}

export interface ErrorResponse {
  message?: string;
}

export interface AccountBalance {
  accountId: string;
  accountName: string;
  balance: number;
  timestamp: string;
  currency: Currency;
}
