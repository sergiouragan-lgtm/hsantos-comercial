"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { PAYMENT_METHODS } from "@/lib/constants";
import { PrimaryButton } from "@/components/ui/atoms";

const COLOR_VAR: Record<string, string> = {
  accent: "var(--accent)",
  gold: "var(--gold)",
  blue: "var(--blue)",
  muted: "var(--text-muted)",
  purple: "var(--purple)",
  orange: "var(--orange)",
};

export default function PaymentScreen({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, actions } = store;
  const methods = PAYMENT_METHODS.map((pm) => ({ ...pm, name: pm.name === "__cardWord__" ? tr.cardWord : pm.name }));
  const local = methods.filter((pm) => pm.group === "local");
  const intl = methods.filter((pm) => pm.group === "intl");

  const renderMethod = (pm: (typeof methods)[number]) => {
    const active = state.selectedPayment === pm.code;
    return (
      <div
        key={pm.code}
        onClick={() => actions.choosePayment(pm.code)}
        className={`flex cursor-pointer items-center gap-3 rounded-2xl bg-card px-3.5 py-3.5 ${
          active ? "border border-accent" : "border border-[rgba(var(--border-rgb),0.08)]"
        }`}
      >
        <div
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] text-xs font-bold text-[#0D1311]"
          style={{ background: COLOR_VAR[pm.color] }}
        >
          {pm.mono}
        </div>
        <div className="flex-1 text-sm font-semibold text-text">{pm.name}</div>
        <div
          className="h-4 w-4 shrink-0 rounded-full"
          style={active ? { border: "5px solid var(--accent)" } : { border: "1px solid rgba(var(--border-rgb),.25)" }}
        />
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-8">
        <h1 className="m-0 font-display text-[22px] font-bold text-text">{tr.paymentTitle}</h1>
        <p className="my-1.5 mb-5 text-[13px] text-muted">{tr.paymentSub}</p>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-auto px-6">
        <div className="text-[10px] uppercase tracking-wide text-muted">{tr.localMethodsLabel}</div>
        {local.map(renderMethod)}
        <div className="mt-2 text-[10px] uppercase tracking-wide text-muted">{tr.internationalMethodsLabel}</div>
        {intl.map(renderMethod)}
      </div>
      <div className="px-6 pb-6 pt-4.5">
        <PrimaryButton onClick={actions.confirmPayment}>{tr.confirmPayment}</PrimaryButton>
      </div>
    </div>
  );
}
