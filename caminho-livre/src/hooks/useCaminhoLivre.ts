"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  AppState,
  CrmStatus,
  CurrencyCode,
  Debt,
  LangCode,
  PaymentMethod,
  PlanCode,
  Strategy,
  Tab,
  ThemeMode,
} from "@/types";
import { PERSISTED_KEYS } from "@/types";
import { createDefaultState } from "@/lib/defaultState";
import { loadPersistedState, savePersistedState } from "@/lib/storage";
import { computeDebtStats, fmtMoney } from "@/lib/calculations";
import { trAll } from "@/lib/translations";
import { getAssistantReply, matchNotePrefix } from "@/lib/assistant";

function uid(): string {
  return "d" + Math.random().toString(36).slice(2, 9);
}

export function useCaminhoLivre() {
  const [state, setState] = useState<AppState>(() => createDefaultState());
  const stateRef = useRef(state);
  stateRef.current = state;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadPersistedState();
    if (!saved) return;
    setState((prev) => {
      const next: AppState = { ...prev, ...saved };
      if (saved.authed) next.screen = "app";
      const lang = saved.lang || "pt";
      if (!saved.chatMessages || saved.chatMessages.length === 0 || !saved.chatMessages[0]?.text) {
        next.chatMessages = [{ role: "assistant", text: trAll(lang).chatIntro }];
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((s: AppState) => {
    const toSave = Object.fromEntries(PERSISTED_KEYS.map((k) => [k, s[k]])) as Pick<
      AppState,
      (typeof PERSISTED_KEYS)[number]
    >;
    savePersistedState(toSave);
  }, []);

  const update = useCallback(
    (patch: Partial<AppState>) => {
      setState((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const updateAndPersist = useCallback(
    (patch: Partial<AppState>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const flashToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setState((prev) => ({ ...prev, showToast: true, toastMsg: msg }));
    toastTimer.current = setTimeout(() => {
      setState((prev) => ({ ...prev, showToast: false }));
    }, 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const tr = useMemo(() => trAll(state.lang), [state.lang]);
  const stats = useMemo(
    () => computeDebtStats(state.debts, state.income, state.essentials, state.strategy),
    [state.debts, state.income, state.essentials, state.strategy]
  );
  const money = useCallback((amountAOA: number) => fmtMoney(amountAOA, state.currency), [state.currency]);

  // ---- auth / onboarding ----
  const setPhone = (v: string) => update({ phone: v, loginError: false, signupError: false });
  const setPassword = (v: string) => update({ password: v, loginError: false, signupError: false });
  const setName = (v: string) => update({ name: v, signupError: false, loginError: false });

  const doLogin = () => {
    if (!state.name || !state.phone || !state.password) {
      update({ loginError: true });
      return;
    }
    updateAndPersist({ screen: "plan", loginError: false });
  };
  const goSignup = () => update({ screen: "signup", signupError: false });
  const goLogin = () => update({ screen: "login", loginError: false });
  const doSignupContinue = () => {
    if (!state.name || !state.phone || !state.password) {
      update({ signupError: true });
      return;
    }
    update({ screen: "plan", signupError: false });
  };
  const choosePlan = (p: PlanCode) => update({ selectedPlan: p });
  // Beta: payment/activation are skipped for now, plan selection goes straight into the app.
  const planContinue = () => updateAndPersist({ authed: true, screen: "app" });
  const choosePayment = (p: PaymentMethod) => update({ selectedPayment: p });
  const confirmPayment = () => {
    update({ paymentStatus: "processing" });
    setTimeout(() => {
      const declined = Math.random() < 0.2;
      if (declined) {
        setState((prev) => ({ ...prev, paymentStatus: "declined" }));
      } else {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setState((prev) => ({
          ...prev,
          paymentStatus: "approved",
          activationCode: code,
          activationInput: "",
          activationError: false,
        }));
      }
    }, 1400);
  };
  const proceedAfterApproval = () => update({ screen: "activation", paymentStatus: "idle" });
  const retryPayment = () => update({ paymentStatus: "idle" });
  const resendCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    update({ activationCode: code });
  };
  const setActivationInput = (v: string) => update({ activationInput: v, activationError: false });
  const activate = () => {
    if (state.activationInput === state.activationCode) {
      updateAndPersist({ authed: true, screen: "app", activationError: false });
    } else {
      update({ activationError: true });
    }
  };
  const logout = () => {
    const next: AppState = { ...stateRef.current, authed: false, screen: "login", phone: "", password: "" };
    setState(next);
    persist(next);
  };

  // ---- navigation ----
  const goTab = (t: Tab) => update({ tab: t });
  const goFaq = () => update({ screen: "faq" });
  const backFromFaq = () => update({ screen: "app" });
  const goPlanManage = () => update({ screen: "plan" });
  const toggleFaq = (i: number) => update({ faqOpenIndex: state.faqOpenIndex === i ? null : i });

  // ---- streak / achievement ----
  const markMonthDone = () => updateAndPersist({ streak: (state.streak || 0) + 1, showAchievement: true });
  const closeAchievement = () => update({ showAchievement: false });

  // ---- debts ----
  const editDebt = (id: string, field: keyof Debt, value: string) => {
    const numericFields: Partial<Record<keyof Debt, true>> = { balance: true, rate: true, minPay: true };
    const v: string | number = numericFields[field] ? parseFloat(value) || 0 : value;
    const debts = state.debts.map((d) => (d.id === id ? { ...d, [field]: v } : d));
    updateAndPersist({ debts });
  };
  const addDebt = () => {
    const debts: Debt[] = state.debts.concat([
      { id: uid(), name: "", balance: 0, rate: 0, minPay: 0, notes: "", phone: "", crmStatus: "contact", nextFollowUp: "" },
    ]);
    updateAndPersist({ debts });
  };
  const removeDebt = (id: string) => updateAndPersist({ debts: state.debts.filter((d) => d.id !== id) });
  const cycleCrmStatus = (id: string) => {
    const order: CrmStatus[] = ["contact", "negotiating", "agreed", "paid"];
    const debt = state.debts.find((d) => d.id === id);
    if (!debt) return;
    const idx = order.indexOf(debt.crmStatus || "contact");
    const next = order[(idx + 1) % order.length];
    editDebt(id, "crmStatus", next);
  };
  const addCrmReminder = (id: string) => {
    const debt = state.debts.find((d) => d.id === id);
    if (!debt) return;
    const text = (tr.crmReminderTextPrefix + " " + (debt.name || "") + (debt.nextFollowUp ? " — " + debt.nextFollowUp : "")).trim();
    const reminders = state.reminders.concat([{ id: uid(), text }]);
    updateAndPersist({ reminders });
    flashToast(tr.crmReminderToast);
  };

  const setStrategy = (s: Strategy) => updateAndPersist({ strategy: s });
  const setCurrency = (c: CurrencyCode) => updateAndPersist({ currency: c });
  const setThemeMode = (mode: ThemeMode) => updateAndPersist({ themeMode: mode });
  const setLang = (l: LangCode) => {
    const wasDefault = state.chatMessages.length === 1 && state.chatMessages[0].role === "assistant";
    const patch: Partial<AppState> = { lang: l };
    if (wasDefault) patch.chatMessages = [{ role: "assistant", text: trAll(l).chatIntro }];
    updateAndPersist(patch);
  };

  const setIncome = (v: string) => updateAndPersist({ income: parseFloat(v) || 0 });
  const setEssentials = (v: string) => updateAndPersist({ essentials: parseFloat(v) || 0 });

  // ---- notifications ----
  const requestNotifPermission = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      flashToast(tr.notifNotSupported);
      return;
    }
    Notification.requestPermission().then((perm) => update({ notifPermission: perm }));
  };
  const testNotification = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      flashToast(tr.congratsMsg);
      return;
    }
    if (Notification.permission === "granted") {
      try {
        new Notification("Caminho Livre", { body: tr.congratsMsg });
      } catch {
        flashToast(tr.congratsMsg);
      }
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        update({ notifPermission: perm });
        if (perm === "granted") {
          try {
            new Notification("Caminho Livre", { body: tr.congratsMsg });
          } catch {
            /* notification blocked by browser despite granted permission */
          }
        } else {
          flashToast(tr.congratsMsg);
        }
      });
    } else {
      flashToast(tr.congratsMsg);
    }
  };
  const toggleNotifPush = () => {
    const next = !state.notifPush;
    updateAndPersist({ notifPush: next });
    if (next) requestNotifPermission();
  };

  const generateReport = () => {
    if (typeof window !== "undefined") window.print();
  };

  // ---- chat / assistant ----
  const setChatInput = (v: string) => update({ chatInput: v });
  const sendChat = useCallback(
    (overrideText?: string) => {
      const raw = (overrideText ?? state.chatInput).trim();
      if (!raw) return;
      const noteText = matchNotePrefix(raw);
      let reminders = state.reminders;
      if (noteText) {
        reminders = reminders.concat([{ id: uid(), text: noteText }]);
      }
      const userMsg = { role: "user" as const, text: raw };
      const history = state.chatMessages.concat([userMsg]);
      const nextState: AppState = { ...state, chatMessages: history, chatInput: "", reminders };
      setState(nextState);
      persist(nextState);

      const reply = noteText
        ? tr.crmReminderToast
        : getAssistantReply(raw, state.lang, stats, state.currency);
      setState((prev) => {
        const withReply = { ...prev, chatMessages: prev.chatMessages.concat([{ role: "assistant" as const, text: reply }]) };
        persist(withReply);
        return withReply;
      });
    },
    [state, tr, stats, persist]
  );
  const sendChipMessage = (text: string) => sendChat(text);

  return {
    state,
    tr,
    stats,
    money,
    actions: {
      setPhone,
      setPassword,
      setName,
      doLogin,
      goSignup,
      goLogin,
      doSignupContinue,
      choosePlan,
      planContinue,
      choosePayment,
      confirmPayment,
      proceedAfterApproval,
      retryPayment,
      resendCode,
      setActivationInput,
      activate,
      logout,
      goTab,
      goFaq,
      backFromFaq,
      goPlanManage,
      toggleFaq,
      markMonthDone,
      closeAchievement,
      editDebt,
      addDebt,
      removeDebt,
      cycleCrmStatus,
      addCrmReminder,
      setStrategy,
      setCurrency,
      setThemeMode,
      setLang,
      setIncome,
      setEssentials,
      toggleNotifPush,
      testNotification,
      generateReport,
      setChatInput,
      sendChat,
      sendChipMessage,
      deleteReminder: (id: string) => updateAndPersist({ reminders: state.reminders.filter((r) => r.id !== id) }),
    },
  };
}

export type CaminhoLivreStore = ReturnType<typeof useCaminhoLivre>;
