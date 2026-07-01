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

    income: 150000,
    essentials: 85000,
    strategy: "snowball",
    debts: [
      {
        id: "d1",
        name: "Kixikila atrasada",
        balance: 45000,
        rate: 0,
        minPay: 8000,
        notes: "",
        phone: "",
        crmStatus: "contact",
        nextFollowUp: "",
      },
      {
        id: "d2",
        name: "Loja de eletrodomésticos",
        balance: 120000,
        rate: 5,
        minPay: 15000,
        notes: "",
        phone: "+244923000000",
        crmStatus: "negotiating",
        nextFollowUp: "Dia 10 — confirmar novo prazo",
      },
      {
        id: "d3",
        name: "Empréstimo de amigo",
        balance: 60000,
        rate: 0,
        minPay: 10000,
        notes: "",
        phone: "+244911000000",
        crmStatus: "agreed",
        nextFollowUp: "",
      },
    ],

    streak: 3,
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
