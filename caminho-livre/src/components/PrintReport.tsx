"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { monthsLabel } from "@/lib/calculations";

export default function PrintReport({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, stats, money } = store;
  const printDate = new Date().toLocaleDateString();
  const strategyDisplayLabel = state.strategy === "snowball" ? tr.snowball : tr.avalanche;
  const rules = [
    [tr.rule1Title, tr.rule1Desc],
    [tr.rule2Title, tr.rule2Desc],
    [tr.rule3Title, tr.rule3Desc],
    [tr.rule4Title, tr.rule4Desc],
    [tr.rule5Title, tr.rule5Desc],
    [tr.rule6Title, tr.rule6Desc],
  ];

  return (
    <div id="cl-print-report" className="absolute left-[-99999px] top-0 w-[800px] bg-white p-12 font-sans text-[#16201C]">
      <div className="font-display text-[26px] font-bold">Caminho Livre</div>
      <div className="mt-1 text-base text-[#666]">
        {tr.reportTitle} — {tr.reportGeneratedOn} {printDate}
      </div>
      <div className="my-7 flex gap-10">
        <div>
          <div className="text-[13px] uppercase text-[#666]">{tr.totalDebt}</div>
          <div className="mt-1 text-[22px] font-bold">{money(stats.totalDebt)}</div>
        </div>
        <div>
          <div className="text-[13px] uppercase text-[#666]">{tr.freeThisMonth}</div>
          <div className="mt-1 text-[22px] font-bold">{money(stats.freeCash)}</div>
        </div>
        <div>
          <div className="text-[13px] uppercase text-[#666]">{tr.strategyLabel}</div>
          <div className="mt-1 text-[22px] font-bold">{strategyDisplayLabel}</div>
        </div>
        <div>
          <div className="text-[13px] uppercase text-[#666]">{tr.freeUntilDebtFree}</div>
          <div className="mt-1 text-[22px] font-bold">{monthsLabel(stats.sim.months, tr)}</div>
        </div>
      </div>
      <div className="mb-2.5 text-lg font-bold">{tr.debtsTitle}</div>
      {state.debts.map((d) => (
        <div key={d.id} className="flex justify-between border-b border-[#e5e5e5] py-2.5 text-[14.5px]">
          <div>{d.name}</div>
          <div>{money(d.balance)}</div>
        </div>
      ))}
      <div className="mb-2.5 mt-6 text-lg font-bold">{tr.rulesLabel}</div>
      {rules.map(([title, desc], i) => (
        <div key={i} className="py-2 text-[14.5px]">
          <strong>{title}</strong> — {desc}
        </div>
      ))}
    </div>
  );
}
