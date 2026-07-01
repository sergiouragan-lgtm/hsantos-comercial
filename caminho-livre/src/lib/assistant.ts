import type { CurrencyCode, DebtStats, LangCode } from "@/types";
import { TR, trAll } from "./translations";
import { fmtMoney, monthsLabel } from "./calculations";

const NOTE_RE = /^(anota|nota|note|ملاحظة|phawula|lura)\s*:\s*/i;

export function matchNotePrefix(raw: string): string | null {
  const m = NOTE_RE.exec(raw);
  if (!m) return null;
  return raw.slice(m[0].length).trim();
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const STRATEGY_KEYWORDS = [
  "snowball",
  "avalanche",
  "bola de neve",
  "boule de neige",
  "iqhwa",
  "kankara",
  "دين",
  "الثلج",
];

const ADVICE_KEYWORDS = [
  "conselho",
  "advice",
  "conseil",
  "شورة",
  "iseluleko",
  "shawara",
];

function scoreOverlap(a: string, b: string): number {
  const wordsA = new Set(normalize(a).split(/\s+/).filter((w) => w.length > 2));
  const wordsB = new Set(normalize(b).split(/\s+/).filter((w) => w.length > 2));
  let score = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) score++;
  });
  return score;
}

export function getAssistantReply(
  rawInput: string,
  lang: LangCode,
  stats: DebtStats,
  currency: CurrencyCode
): string {
  const tr = trAll(lang);
  const normalized = normalize(rawInput);

  if (STRATEGY_KEYWORDS.some((k) => normalized.includes(normalize(k)))) {
    const faq = tr.faqItems?.[1];
    if (faq) return faq.a;
  }

  if (ADVICE_KEYWORDS.some((k) => normalized.includes(normalize(k)))) {
    const freeCashFormatted = fmtMoney(stats.freeCash, currency);
    const focusName = stats.focusDebt?.name || "—";
    const monthsTxt = monthsLabel(stats.sim.months, tr);
    return `${tr.freeThisMonth}: ${freeCashFormatted}. ${tr.focusDebtTitle}: ${focusName}. ${tr.freeUntilDebtFree} ${monthsTxt}.`;
  }

  let bestScore = 0;
  let bestAnswer = "";
  (tr.faqItems || []).forEach((item) => {
    const score = scoreOverlap(rawInput, item.q);
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.a;
    }
  });
  if (bestScore >= 2) return bestAnswer;

  return tr.chatIntro;
}

export function buildWhatsappText(tr: ReturnType<typeof trAll>, stats: DebtStats, currency: CurrencyCode): string {
  return (
    tr.tagline +
    " — " +
    tr.totalDebt +
    ": " +
    fmtMoney(stats.totalDebt, currency) +
    ". " +
    tr.freeUntilDebtFree +
    " " +
    monthsLabel(stats.sim.months, tr) +
    "."
  );
}

export { TR };
