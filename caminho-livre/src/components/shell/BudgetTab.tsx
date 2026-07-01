"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { BUCKET_COLORS, BUCKET_PCTS } from "@/lib/constants";

const COLOR_VAR: Record<(typeof BUCKET_COLORS)[number], string> = {
  accent: "var(--accent)",
  orange: "var(--orange)",
  blue: "var(--blue)",
  purple: "var(--purple)",
};

export default function BudgetTab({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, money, actions } = store;
  const bucketLabels = [tr.bucketEssentials, tr.bucketDebt, tr.bucketReserve, tr.bucketFreedom];

  return (
    <div className="px-5.5 pb-6 pt-5">
      <div className="mb-1.5 font-display text-lg font-bold text-text">{tr.budgetTitle}</div>
      <div className="mb-4 text-xs leading-relaxed text-muted">{tr.budgetSub}</div>

      <div className="mb-4.5 grid grid-cols-2 gap-2.5">
        <label className="block">
          <span className="mb-1.5 block text-[11px] text-muted">{tr.incomeLabel}</span>
          <input
            value={state.income}
            onChange={(e) => actions.setIncome(e.target.value)}
            type="number"
            className="w-full box-border rounded-[11px] border border-[rgba(var(--border-rgb),0.12)] bg-card px-3 py-2.5 text-sm text-text outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] text-muted">{tr.essentialsLabel}</span>
          <input
            value={state.essentials}
            onChange={(e) => actions.setEssentials(e.target.value)}
            type="number"
            className="w-full box-border rounded-[11px] border border-[rgba(var(--border-rgb),0.12)] bg-card px-3 py-2.5 text-sm text-text outline-none"
          />
        </label>
      </div>

      {BUCKET_PCTS.map((pct, i) => (
        <div key={i} className="mb-3.5">
          <div className="mb-1.5 flex justify-between gap-2 text-[11.5px] text-text">
            <span>{bucketLabels[i]}</span>
            <span className="whitespace-nowrap text-muted">
              {Math.round(pct * 100)}% · {money((state.income || 0) * pct)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-card">
            <div className="h-full rounded-full" style={{ background: COLOR_VAR[BUCKET_COLORS[i]], width: `${pct * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
