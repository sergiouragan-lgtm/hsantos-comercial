import type { Language } from "./i18n/config";

const LOCALE_MAP: Record<Language, string> = {
  pt: "pt-PT",
  en: "en-US",
  fr: "fr-FR",
  ar: "ar-EG",
  zh: "zh-CN",
};

export function localeFor(lang?: Language): string {
  return lang ? LOCALE_MAP[lang] : "pt-PT";
}

export function formatMoney(
  value: number | string,
  currency = "AOA",
  lang?: Language
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  try {
    return new Intl.NumberFormat(localeFor(lang), {
      style: "currency",
      currency,
    }).format(num);
  } catch {
    return `${currency} ${num.toFixed(2)}`;
  }
}

export function formatDate(date: Date | string, lang?: Language): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(localeFor(lang), {
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
