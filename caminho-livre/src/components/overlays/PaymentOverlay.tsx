"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";

export default function PaymentOverlay({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, actions } = store;
  if (state.paymentStatus === "idle") return null;

  return (
    <div className="absolute inset-0 z-[22] flex items-center justify-center bg-black/60">
      <div className="w-[280px] rounded-[20px] border border-[rgba(var(--border-rgb),0.1)] bg-card p-7 text-center">
        {state.paymentStatus === "processing" && (
          <div>
            <svg width="44" height="44" viewBox="0 0 44 44" className="animate-cl-spin">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(var(--border-rgb),.12)" strokeWidth={4} />
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--accent)" strokeWidth={4} strokeLinecap="round" strokeDasharray="70 113" />
            </svg>
            <div className="mt-4 text-[13px] text-muted">{tr.paymentProcessing}</div>
          </div>
        )}

        {state.paymentStatus === "approved" && (
          <div>
            <div className="mx-auto mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[rgba(var(--accent-rgb),0.15)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l5 5L19 7" stroke="var(--accent)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="font-display text-[19px] font-bold text-text">{tr.paymentApprovedTitle}</div>
            <div className="mt-2 text-[12.5px] leading-relaxed text-muted">{tr.paymentApprovedMsg}</div>
            <div
              onClick={actions.proceedAfterApproval}
              className="mt-4.5 cursor-pointer rounded-[11px] bg-accent py-2.5 text-[13px] font-bold text-[#0D1311]"
            >
              {tr.continueBtn}
            </div>
          </div>
        )}

        {state.paymentStatus === "declined" && (
          <div>
            <div className="mx-auto mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[rgba(var(--orange-rgb),0.15)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="var(--orange)" strokeWidth={2.6} strokeLinecap="round" />
              </svg>
            </div>
            <div className="font-display text-[19px] font-bold text-text">{tr.paymentDeclinedTitle}</div>
            <div className="mt-2 text-[12.5px] leading-relaxed text-muted">{tr.paymentDeclinedMsg}</div>
            <div
              onClick={actions.retryPayment}
              className="mt-4.5 cursor-pointer rounded-[11px] border border-[rgba(var(--orange-rgb),0.4)] bg-[rgba(var(--orange-rgb),0.15)] py-2.5 text-[13px] font-bold text-orange"
            >
              {tr.tryAgainBtn}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
