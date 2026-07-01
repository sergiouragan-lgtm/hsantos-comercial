"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { PLAN_PRICES } from "@/lib/constants";
import { PrimaryButton } from "@/components/ui/atoms";
import type { PlanCode } from "@/types";

export default function PlanScreen({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, money, actions } = store;

  const pctQuarterly = Math.round((1 - PLAN_PRICES.trimestral / (PLAN_PRICES.mensal * 3)) * 100);
  const pctYearly = Math.round((1 - PLAN_PRICES.anual / (PLAN_PRICES.mensal * 12)) * 100);

  const plans: { code: PlanCode; name: string; price: string; sub: string; badge: string }[] = [
    { code: "mensal", name: tr.monthly, price: money(PLAN_PRICES.mensal), sub: tr.perMonth, badge: "" },
    {
      code: "trimestral",
      name: tr.quarterly,
      price: money(PLAN_PRICES.trimestral),
      sub: tr.perQuarter,
      badge: tr.saveTemplate.replace("{pct}", String(pctQuarterly)),
    },
    {
      code: "anual",
      name: tr.yearly,
      price: money(PLAN_PRICES.anual),
      sub: tr.perYear,
      badge: tr.saveTemplate.replace("{pct}", String(pctYearly)) + " · " + tr.bestValue,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-8">
        <h1 className="m-0 font-display text-[22px] font-bold text-text">{tr.choosePlanTitle}</h1>
        <p className="my-1.5 mb-5 text-[13px] text-muted">{tr.choosePlanSub}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-auto px-6">
        {plans.map((p) => {
          const active = state.selectedPlan === p.code;
          return (
            <div
              key={p.code}
              onClick={() => actions.choosePlan(p.code)}
              className={`cursor-pointer rounded-2xl p-4 ${
                active ? "border border-accent bg-[rgba(var(--accent-rgb),0.1)]" : "border border-[rgba(var(--border-rgb),0.08)] bg-card"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-display text-base font-bold text-text">{p.name}</div>
                {p.badge && (
                  <div className="whitespace-nowrap rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-bold text-[#0D1311]">{p.badge}</div>
                )}
              </div>
              <div className="mt-2">
                <span className="font-display text-[21px] font-bold text-accent">{p.price}</span>
                <span className="text-xs text-muted"> {p.sub}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-6 pb-6 pt-4.5">
        <PrimaryButton onClick={actions.planContinue}>{tr.continueBtn}</PrimaryButton>
      </div>
    </div>
  );
}
