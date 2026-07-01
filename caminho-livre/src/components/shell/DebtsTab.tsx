"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { monthsLabel } from "@/lib/calculations";
import type { Debt } from "@/types";

export default function DebtsTab({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, stats, money, actions } = store;
  const cashWarningVisible = stats.freeCash <= 0 && stats.totalDebt > 0;
  const hasFocusDebt = !!stats.focusDebt;
  const showOtherNote = !!(stats.focusDebt && stats.simOther.months !== stats.sim.months);
  const stallWarningVisible = !!stats.focusDebt && !stats.sim.cleared;
  const otherStrategyLabel = state.strategy === "snowball" ? tr.avalanche : tr.snowball;

  const strategyBtn = (active: boolean) =>
    `flex-1 cursor-pointer rounded-2xl px-3.5 py-3.5 text-left ${
      active
        ? "border border-accent bg-[rgba(var(--accent-rgb),0.12)] text-text"
        : "border border-[rgba(var(--border-rgb),0.08)] bg-card text-muted"
    }`;

  const numberField = (debt: Debt, field: "balance" | "rate" | "minPay", label: string) => (
    <label className="block" key={field}>
      <span className="mb-1 block text-[9.5px] text-muted">{label}</span>
      <input
        value={debt[field]}
        onChange={(e) => actions.editDebt(debt.id, field, e.target.value)}
        type="number"
        className="w-full box-border rounded-[9px] border border-[rgba(var(--border-rgb),0.1)] bg-bg px-2 py-2 text-[12.5px] text-text outline-none"
      />
    </label>
  );

  return (
    <div className="px-5.5 pb-6 pt-5">
      <div className="mb-3.5 font-display text-lg font-bold text-text">{tr.debtsTitle}</div>

      <div className="mb-4 flex gap-2">
        <div onClick={() => actions.setStrategy("snowball")} className={strategyBtn(state.strategy === "snowball")}>
          <div className="text-[13px] font-bold">{tr.snowball}</div>
          <div className="mt-0.5 text-[10.5px] leading-snug">{tr.snowballDesc}</div>
        </div>
        <div onClick={() => actions.setStrategy("avalanche")} className={strategyBtn(state.strategy === "avalanche")}>
          <div className="text-[13px] font-bold">{tr.avalanche}</div>
          <div className="mt-0.5 text-[10.5px] leading-snug">{tr.avalancheDesc}</div>
        </div>
      </div>

      {cashWarningVisible && (
        <div className="mb-3.5 rounded-xl border border-[rgba(var(--orange-rgb),0.3)] bg-[rgba(var(--orange-rgb),0.1)] px-3.5 py-2.5 text-[11.5px] text-orange">
          {tr.cashWarning}
        </div>
      )}

      {state.debts.map((d) => (
        <div key={d.id} className="relative mb-2.5 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-3.5">
          {stats.focusDebt?.id === d.id && (
            <div className="absolute -top-2 right-3 rounded-full bg-accent px-2 py-0.5 text-[9.5px] font-bold text-[#0D1311]">
              {tr.focusDebtTitle}
            </div>
          )}
          <div className="mb-2 flex gap-2">
            <input
              value={d.name}
              onChange={(e) => actions.editDebt(d.id, "name", e.target.value)}
              placeholder={tr.creditorLabel}
              className="min-w-0 flex-1 rounded-[9px] border border-[rgba(var(--border-rgb),0.1)] bg-bg px-2.5 py-2.5 text-[13px] text-text outline-none"
            />
            <div
              onClick={() => actions.removeDebt(d.id)}
              className="flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-[9px] border border-[rgba(var(--border-rgb),0.1)] bg-bg text-sm text-muted"
            >
              ✕
            </div>
          </div>
          <div className="mb-2 grid grid-cols-3 gap-1.5">
            {numberField(d, "balance", tr.balanceLabel)}
            {numberField(d, "rate", tr.rateLabel)}
            {numberField(d, "minPay", tr.minPaymentLabel)}
          </div>
          <input
            value={d.notes}
            onChange={(e) => actions.editDebt(d.id, "notes", e.target.value)}
            placeholder={tr.notesPlaceholder}
            className="w-full box-border rounded-[9px] border border-[rgba(var(--border-rgb),0.1)] bg-bg px-2.5 py-2 text-xs text-muted outline-none"
          />
        </div>
      ))}

      <div
        onClick={actions.addDebt}
        className="mb-4 cursor-pointer rounded-xl border border-dashed border-[rgba(var(--border-rgb),0.2)] px-3 py-3 text-center text-[13px] font-semibold text-accent"
      >
        {tr.addDebt}
      </div>

      {hasFocusDebt && stats.focusDebt && (
        <div className="rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4">
          <div className="text-[10px] uppercase tracking-wide text-muted">{tr.focusDebtTitle}</div>
          <div className="mt-1 font-display text-base font-bold text-text">{stats.focusDebt.name}</div>
          <div className="mt-3 flex flex-wrap gap-6.5">
            <div>
              <div className="text-[9.5px] uppercase text-muted">{tr.freeUntilDebtFree}</div>
              <div className="mt-0.5 font-display text-[17px] font-bold text-accent">{monthsLabel(stats.sim.months, tr)}</div>
            </div>
            <div>
              <div className="text-[9.5px] uppercase text-muted">{tr.interestPaid}</div>
              <div className="mt-0.5 font-display text-[17px] font-bold text-orange">{money(stats.sim.totalInterest)}</div>
            </div>
          </div>
          {showOtherNote && (
            <div className="mt-2.5 text-[11px] text-muted">
              {otherStrategyLabel}: {monthsLabel(stats.simOther.months, tr)}
            </div>
          )}
        </div>
      )}

      {stallWarningVisible && (
        <div className="mt-3 rounded-xl border border-[rgba(var(--orange-rgb),0.3)] bg-[rgba(var(--orange-rgb),0.1)] px-3.5 py-2.5 text-[11.5px] text-orange">
          {tr.stallWarning}
        </div>
      )}
    </div>
  );
}
