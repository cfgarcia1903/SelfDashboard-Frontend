import { Wallet } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { AccountBalance } from "@/types/api";

export function AccountBalanceCard({ account }: { account: AccountBalance }) {
  return <article className="account-card"><div className="account-card-heading"><span className="account-icon"><Wallet size={17} /></span><span>{account.accountName}</span><span className="account-status">Activo</span></div><strong>{formatCurrency(account.balance, account.currency)}</strong><p>Actualizado: {formatDate(account.timestamp)}</p></article>;
}
