export type LangCode = "pt" | "en" | "fr" | "ar" | "zu" | "ha";
export type CurrencyCode = "AOA" | "USD" | "EUR" | "NGN" | "AED" | "ZAR";
export type ThemeMode = "auto" | "light" | "dark";
export type Strategy = "snowball" | "avalanche";
export type Screen = "login" | "signup" | "plan" | "payment" | "activation" | "app" | "faq";
export type Tab = "inicio" | "dividas" | "crm" | "orcamento" | "assistente" | "mais";
export type CrmStatus = "contact" | "negotiating" | "agreed" | "paid";
export type PlanCode = "mensal" | "trimestral" | "anual";
export type PaymentMethod = "multicaixa" | "unitel" | "appypay" | "cartao" | "paypal" | "visamc";
export type PaymentStatus = "idle" | "processing" | "approved" | "declined";

export interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPay: number;
  notes: string;
  phone: string;
  crmStatus: CrmStatus;
  nextFollowUp: string;
}

export interface ChatMessage {
  role: "assistant" | "user";
  text: string;
}

export interface Reminder {
  id: string;
  text: string;
}

export interface AppState {
  screen: Screen;
  tab: Tab;
  authed: boolean;
  lang: LangCode;
  currency: CurrencyCode;
  faqOpenIndex: number | null;
  themeMode: ThemeMode;

  name: string;
  phone: string;
  password: string;
  loginError: boolean;
  signupError: boolean;

  selectedPlan: PlanCode;
  selectedPayment: PaymentMethod;
  paymentStatus: PaymentStatus;
  activationCode: string;
  activationInput: string;
  activationError: boolean;

  income: number;
  essentials: number;
  strategy: Strategy;
  debts: Debt[];

  streak: number;
  showAchievement: boolean;

  chatInput: string;
  chatMessages: ChatMessage[];

  reminders: Reminder[];
  notifPush: boolean;
  notifPermission: NotificationPermission | "default";

  showToast: boolean;
  toastMsg: string;
}

export interface SimResult {
  months: number;
  totalInterest: number;
  cleared: boolean;
}

export interface DebtStats {
  totalDebt: number;
  totalMin: number;
  freeCash: number;
  sim: SimResult;
  simOther: SimResult;
  focusDebt: Debt | null;
}

export const PERSISTED_KEYS = [
  "authed",
  "lang",
  "currency",
  "name",
  "phone",
  "selectedPlan",
  "income",
  "essentials",
  "strategy",
  "debts",
  "streak",
  "reminders",
  "notifPush",
  "chatMessages",
  "themeMode",
] as const;

export type PersistedState = Pick<AppState, (typeof PERSISTED_KEYS)[number]>;
