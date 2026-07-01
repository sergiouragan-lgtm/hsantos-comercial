import type { AppState } from "@/types";
import { TR } from "./translations";

export function createDefaultState(): AppState {
  return {
    screen: "login",
    tab: "inicio",
    authed: false,
    lang: "pt",
    currency: "AOA",
    faqOpenIndex: null,
    themeMode: "auto",

    name: "",
    phone: "",
    password: "",
    loginError: false,
    signupError: false,

    selectedPlan: "anual",
    selectedPayment: "multicaixa",
    paymentStatus: "idle",
    activationCode: "",
    activationInput: "",
    activationError: false,

    income: 0,
    essentials: 0,
    strategy: "snowball",
    debts: [],

    streak: 0,
    showAchievement: false,

    chatInput: "",
    chatMessages: [{ role: "assistant", text: TR.pt.chatIntro }],

    reminders: [],
    notifPush: false,
    notifPermission: "default",

    showToast: false,
    toastMsg: "",
  };
}
