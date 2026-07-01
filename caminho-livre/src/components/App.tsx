"use client";

import { useCaminhoLivre } from "@/hooks/useCaminhoLivre";
import { useEffectiveTheme } from "@/hooks/useEffectiveTheme";
import LoginScreen from "@/components/screens/LoginScreen";
import SignupScreen from "@/components/screens/SignupScreen";
import PlanScreen from "@/components/screens/PlanScreen";
import PaymentScreen from "@/components/screens/PaymentScreen";
import ActivationScreen from "@/components/screens/ActivationScreen";
import FaqScreen from "@/components/screens/FaqScreen";
import AppShell from "@/components/screens/AppShell";
import PaymentOverlay from "@/components/overlays/PaymentOverlay";
import AchievementModal from "@/components/overlays/AchievementModal";
import Toast from "@/components/overlays/Toast";
import PrintReport from "@/components/PrintReport";

export default function App() {
  const store = useCaminhoLivre();
  const { state } = store;
  const { themeVars } = useEffectiveTheme(state.themeMode);
  const dir = state.lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="flex min-h-screen items-stretch justify-center bg-outerbg sm:items-center sm:p-8">
      <div
        dir={dir}
        style={themeVars}
        className="relative flex min-h-screen w-full flex-col bg-bg font-sans text-text sm:min-h-[812px] sm:w-[412px] sm:overflow-hidden sm:rounded-[32px] sm:shadow-2xl"
      >
        {state.screen === "login" && <LoginScreen store={store} />}
        {state.screen === "signup" && <SignupScreen store={store} />}
        {state.screen === "plan" && <PlanScreen store={store} />}
        {state.screen === "payment" && <PaymentScreen store={store} />}
        {state.screen === "activation" && <ActivationScreen store={store} />}
        {state.screen === "faq" && <FaqScreen store={store} />}
        {state.screen === "app" && <AppShell store={store} />}

        <PaymentOverlay store={store} />
        <AchievementModal store={store} />
        <Toast store={store} />
      </div>
      <PrintReport store={store} />
    </div>
  );
}
