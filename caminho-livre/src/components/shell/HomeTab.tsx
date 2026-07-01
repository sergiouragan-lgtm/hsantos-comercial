"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { monthsLabel } from "@/lib/calculations";
import { ChevronRight } from "@/components/ui/atoms";

export default function HomeTab({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, stats, money, actions } = store;

  const r = 78;
  const c = 2 * Math.PI * r;
  const progressPct = stats.totalDebt > 0 ? Math.min((stats.freeCash * 6) / stats.totalDebt, 1) : 0;
  const arcDashArray = `${(c * progressPct).toFixed(1)} ${c.toFixed(1)}`;
  const arcPctLabel = stats.totalDebt > 0 ? `${Math.round(progressPct * 100)}%` : "—";
  const focusMonthsLabel = monthsLabel(stats.sim.months, tr);

  return (
    <div>
      <div className="flex items-center justify-between px-5.5 pt-5">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[1.4px] text-accent">{tr.todayPlan}</div>
          <div className="mt-1 font-display text-lg font-bold text-text">
            {tr.greeting}, {state.name}
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-[rgba(var(--border-rgb),0.12)] bg-card">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4a5 5 0 00-5 5v3.2c0 .8-.3 1.6-.9 2.2L5 16h14l-1.1-1.6a3 3 0 01-.9-2.2V9a5 5 0 00-5-5z"
              stroke="var(--text)"
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            <path d="M10 19a2 2 0 004 0" stroke="var(--text)" strokeWidth={1.6} strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="mx-5.5 mt-4 flex flex-col items-center rounded-[20px] border border-[rgba(var(--border-rgb),0.08)] bg-card px-4.5 py-6">
        <svg width="146" height="146" viewBox="0 0 190 190">
          <circle cx="95" cy="95" r="78" fill="none" stroke="rgba(var(--border-rgb),.10)" strokeWidth={14} />
          <circle
            cx="95"
            cy="95"
            r="78"
            fill="none"
            stroke="url(#gApp)"
            strokeWidth={14}
            strokeLinecap="round"
            transform="rotate(-90 95 95)"
            strokeDasharray={arcDashArray}
          />
          <defs>
            <linearGradient id="gApp" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent2)" />
            </linearGradient>
          </defs>
          <text x="95" y="90" textAnchor="middle" fontSize="32" fontWeight="700" fill="var(--text)" fontFamily="var(--font-space-grotesk), sans-serif">
            {arcPctLabel}
          </text>
          <text x="95" y="114" textAnchor="middle" fontSize="11" fill="var(--text-muted)" letterSpacing="0.5" fontFamily="var(--font-jakarta), sans-serif">
            {tr.alreadyPlanned}
          </text>
        </svg>
        <div className="mt-1 font-display text-[20px] font-bold text-text">{focusMonthsLabel}</div>
        <div className="mt-0.5 text-sm text-muted">{tr.untilLastDebt}</div>
      </div>

      <div className="mx-5.5 mt-3.5 flex items-center gap-2 rounded-xl border border-[rgba(var(--gold-rgb),0.35)] bg-[rgba(var(--gold-rgb),0.12)] px-3.5 py-2.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.5c1 3 4 4 4 8a4 4 0 11-8 0c0-1.3.5-2.2 1.1-3 .2 1 .9 1.6 1.4 1.2-.4-2 .3-4 1.5-6.2z"
            fill="var(--gold)"
          />
        </svg>
        <div className="text-sm font-semibold text-text">
          {state.streak} {tr.streakLabel}
        </div>
      </div>

      <div className="mx-5.5 mt-3.5 flex gap-2.5">
        <div className="flex-1 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-3.5">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-muted">{tr.totalDebt}</div>
          <div className="mt-1 font-display text-[18px] font-bold text-orange">{money(stats.totalDebt)}</div>
        </div>
        <div className="flex-1 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-3.5">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-muted">{tr.freeThisMonth}</div>
          <div className="mt-1 font-display text-[18px] font-bold text-accent">{money(stats.freeCash)}</div>
        </div>
      </div>

      <div
        onClick={actions.markMonthDone}
        className="mx-5.5 mt-3.5 cursor-pointer rounded-2xl border border-[rgba(var(--accent-rgb),0.3)] px-4 py-4 text-center text-[14.5px] font-bold text-accent"
        style={{ background: "linear-gradient(135deg,rgba(var(--accent-rgb),.16),rgba(var(--accent-rgb),.04))" }}
      >
        {tr.markMonthDone}
      </div>

      <div
        onClick={() => actions.goTab("assistente")}
        className="mx-5.5 mb-4.5 mt-2.5 flex cursor-pointer items-center justify-between rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4"
      >
        <div>
          <div className="text-[14.5px] font-bold text-text">{tr.needAdvice}</div>
          <div className="mt-0.5 text-[13px] text-muted">{tr.talkToAssistant}</div>
        </div>
        <ChevronRight />
      </div>
    </div>
  );
}
