import type { CurrencyCode, LangCode, PaymentMethod } from "@/types";

export const AOA_PER_UNIT: Record<CurrencyCode, number> = {
  AOA: 1,
  USD: 920,
  EUR: 990,
  NGN: 0.667,
  AED: 250,
  ZAR: 50,
};

export const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  AOA: "Kz",
  USD: "$",
  EUR: "€",
  NGN: "₦",
  AED: "AED",
  ZAR: "R",
};

export const CURRENCY_LIST: { code: CurrencyCode; label: string }[] = [
  { code: "AOA", label: "Kwanza (Kz)" },
  { code: "USD", label: "Dólar (US$)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "NGN", label: "Naira (₦)" },
  { code: "AED", label: "Dirham (AED)" },
  { code: "ZAR", label: "Rand (R)" },
];

export const LANGUAGE_LIST: { code: LangCode; label: string }[] = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "zu", label: "isiZulu" },
  { code: "ha", label: "Hausa" },
];

interface ThemeColors {
  bg: string;
  outerBg: string;
  card: string;
  navBg: string;
  text: string;
  textMuted: string;
  borderRgb: string;
  accent: string;
  accentRgb: string;
  accent2: string;
  gold: string;
  goldRgb: string;
  orange: string;
  orangeRgb: string;
  blue: string;
  blueRgb: string;
  purple: string;
}

export const THEMES: Record<"dark" | "light", ThemeColors> = {
  dark: {
    bg: "#0D1311",
    outerBg: "#080B0A",
    card: "#161F1B",
    navBg: "#11211B",
    text: "#EAF3EE",
    textMuted: "#8AA398",
    borderRgb: "255,255,255",
    accent: "#34E0A1",
    accentRgb: "52,224,161",
    accent2: "#1FAE7C",
    gold: "#D7A23A",
    goldRgb: "215,162,58",
    orange: "#E2884A",
    orangeRgb: "226,136,74",
    blue: "#3E9BD8",
    blueRgb: "62,155,216",
    purple: "#B98CE0",
  },
  light: {
    bg: "#F2F0EA",
    outerBg: "#E4E1D6",
    card: "#FFFFFF",
    navBg: "#FFFFFF",
    text: "#1C2420",
    textMuted: "#69766F",
    borderRgb: "20,30,25",
    accent: "#1B9E6E",
    accentRgb: "27,158,110",
    accent2: "#157A55",
    gold: "#9E7020",
    goldRgb: "158,112,32",
    orange: "#BF622A",
    orangeRgb: "191,98,42",
    blue: "#2B6F9E",
    blueRgb: "43,111,158",
    purple: "#7A50B2",
  },
};

export const PLAN_PRICES = { mensal: 7000, trimestral: 18000, anual: 60000 };

export const PAYMENT_METHODS: {
  code: PaymentMethod;
  name: string;
  mono: string;
  color: "accent" | "gold" | "blue" | "muted" | "purple" | "orange";
  group: "local" | "intl";
}[] = [
  { code: "multicaixa", name: "Multicaixa Express", mono: "ME", color: "accent", group: "local" },
  { code: "unitel", name: "Unitel Money", mono: "UM", color: "gold", group: "local" },
  { code: "appypay", name: "AppyPay", mono: "AP", color: "blue", group: "local" },
  { code: "cartao", name: "__cardWord__", mono: "$", color: "muted", group: "local" },
  { code: "paypal", name: "PayPal", mono: "PP", color: "purple", group: "intl" },
  { code: "visamc", name: "Visa / Mastercard", mono: "VM", color: "orange", group: "intl" },
];

export const CRM_STATUS_ORDER: readonly ("contact" | "negotiating" | "agreed" | "paid")[] = [
  "contact",
  "negotiating",
  "agreed",
  "paid",
];

export const BUCKET_PCTS = [0.55, 0.3, 0.1, 0.05];
export const BUCKET_COLORS = ["accent", "orange", "blue", "purple"] as const;

// Bump this whenever the persisted shape or onboarding flow changes materially,
// so testers with stale localStorage from an earlier build start fresh automatically.
export const STORAGE_KEY = "caminholivre_state_v2";
