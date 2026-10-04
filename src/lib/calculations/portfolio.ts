export interface PortfolioComposition {
  invested: number;
  reservedCash: number;
  availableCash: number;
  total: number;
  discrepancy: number;
}

export function calculatePortfolioComposition(totalBalance: number, totalCash: number, reservedCash: number, availableCash: number): PortfolioComposition {
  const invested = totalBalance - totalCash;
  const total = invested + reservedCash + availableCash;
  return { invested, reservedCash, availableCash, total, discrepancy: total - totalBalance };
}

export function calculateReturnPercentage(balance: number | null, deposited: number | null): number | null {
  if (balance === null || deposited === null || !Number.isFinite(balance) || !Number.isFinite(deposited) || deposited <= 0) return null;
  return ((balance - deposited) / deposited) * 100;
}
