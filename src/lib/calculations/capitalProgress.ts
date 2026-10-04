export interface CapitalProgressInput {
  deposited: number | null | undefined;
  balance: number | null | undefined;
}

export type ProgressScale = "linear" | "logarithmic" | "unavailable";

export interface CapitalProgressResult {
  deposited: number | null;
  balance: number | null;
  difference: number | null;
  returnPercentage: number | null;
  depositedVisualPercent: number | null;
  balanceVisualPercent: number | null;
  scale: ProgressScale;
}

export function clampProgressPosition(value: number, minimum = 8, maximum = 92): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getProgressPosition(visualPercent: number | null): number | null {
  return visualPercent === null || !Number.isFinite(visualPercent) ? null : clampProgressPosition(50 + (visualPercent - 100) / 2);
}

function finiteOrNull(value: number | null | undefined): number | null {
  return value !== null && value !== undefined && Number.isFinite(value) ? value : null;
}

export function getProgressScale({ deposited, balance }: CapitalProgressInput): ProgressScale {
  const safeDeposited = finiteOrNull(deposited);
  const safeBalance = finiteOrNull(balance);
  if (safeDeposited === null || safeBalance === null || safeDeposited < 0 || safeBalance < 0) return "unavailable";
  if (safeBalance > 0 && safeDeposited / safeBalance < 0.5) return "logarithmic";
  return "linear";
}

export function getProgressVisualValue(value: number | null | undefined, deposited: number | null | undefined, scale: ProgressScale): number | null {
  const safeValue = finiteOrNull(value);
  const safeDeposited = finiteOrNull(deposited);
  if (safeValue === null || safeDeposited === null || safeValue < 0 || safeDeposited < 0 || scale === "unavailable") return null;
  if (safeDeposited === 0) return safeValue === 0 ? 0 : 100;
  if (scale === "linear") return (safeValue / safeDeposited) * 100;
  const ratio = safeValue / safeDeposited;
  return ratio <= 1 ? ratio * 100 : 100 + Math.log10(ratio) * 100;
}

export function calculateCapitalProgress(input: CapitalProgressInput): CapitalProgressResult {
  const deposited = finiteOrNull(input.deposited);
  const balance = finiteOrNull(input.balance);
  const scale = getProgressScale(input);
  const difference = deposited !== null && balance !== null ? balance - deposited : null;
  const returnPercentage = deposited !== null && deposited > 0 && difference !== null ? (difference / deposited) * 100 : null;
  return {
    deposited,
    balance,
    difference,
    returnPercentage,
    depositedVisualPercent: getProgressVisualValue(deposited, deposited, scale),
    balanceVisualPercent: getProgressVisualValue(balance, deposited, scale),
    scale
  };
}
