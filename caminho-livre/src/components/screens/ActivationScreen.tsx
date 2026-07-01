"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { PrimaryButton } from "@/components/ui/atoms";

export default function ActivationScreen({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, actions } = store;

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-8">
        <h1 className="m-0 font-display text-[22px] font-bold text-text">{tr.activationTitle}</h1>
        <p className="my-1.5 mb-5 text-[13px] text-muted">{tr.activationSub}</p>
      </div>
      <div className="flex-1 overflow-auto px-6">
        <div className="mb-4.5 rounded-xl border border-[rgba(var(--gold-rgb),0.32)] bg-[rgba(var(--gold-rgb),0.1)] px-3.5 py-3.5">
          <div className="mb-1 text-[11px] font-semibold text-gold">{tr.codeSentDemo}</div>
          <div className="font-display text-[22px] font-bold tracking-[3px] text-gold">{state.activationCode}</div>
        </div>
        <label className="mb-2 block">
          <input
            value={state.activationInput}
            onChange={(e) => actions.setActivationInput(e.target.value)}
            placeholder="000000"
            className="w-full box-border rounded-xl border border-[rgba(var(--border-rgb),0.12)] bg-card px-3.5 py-3.5 text-center text-xl tracking-[4px] text-text outline-none"
          />
        </label>
        {state.activationError && (
          <div className="mb-2 text-center text-xs text-orange">{tr.wrongCode}</div>
        )}
        <div className="mt-2.5 text-center">
          <span onClick={actions.resendCode} className="cursor-pointer text-[12.5px] font-semibold text-accent">
            {tr.resendCode}
          </span>
        </div>
      </div>
      <div className="px-6 pb-6 pt-4.5">
        <PrimaryButton onClick={actions.activate}>{tr.activateBtn}</PrimaryButton>
      </div>
    </div>
  );
}
