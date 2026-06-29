export function formatMoney(
  value: number | string,
  currency = "BRL"
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(num);
  } catch {
    return `R$ ${num.toFixed(2)}`;
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function startOfPeriod(period: "day" | "week" | "month"): Date {
  const now = new Date();
  if (period === "day") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "week") {
    const day = now.getDay(); // 0 = domingo
    const diff = (day + 6) % 7; // segunda como início
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    return start;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export const STAGE_LABELS: Record<string, string> = {
  LEAD: "Lead",
  PROSPECT: "Prospecto",
  NEGOTIATION: "Negociação",
  CUSTOMER: "Cliente",
  LOST: "Perdido",
};
