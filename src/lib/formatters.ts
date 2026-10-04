export function formatCurrency(value: number | null | undefined, currency = "USD"): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "No disponible";
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "No disponible";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "Fecha no disponible";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
