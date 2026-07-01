"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { CURRENCY_LIST, LANGUAGE_LIST } from "@/lib/constants";
import { ChevronRight } from "@/components/ui/atoms";
import type { ThemeMode } from "@/types";

function Chip({ active, wide, onClick, children }: { active: boolean; wide?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-full font-bold ${wide ? "px-3.5 py-2 text-xs" : "px-2.5 py-1.5 text-[11px]"} ${
        active
          ? "bg-accent text-[#0D1311]"
          : `border border-[rgba(var(--border-rgb),0.1)] font-semibold text-muted ${wide ? "bg-bg" : "bg-card"}`
      }`}
    >
      {children}
    </div>
  );
}

export default function MoreTab({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, actions } = store;
  const nameOrDefault = state.name || "Beatriz";
  const initials = (nameOrDefault.trim().slice(0, 1) || "C").toUpperCase();

  const planLabelByCode = { mensal: tr.monthly, trimestral: tr.quarterly, anual: tr.yearly };
  const currentPlanLabel = planLabelByCode[state.selectedPlan] || tr.yearly;

  const themeModes: { code: ThemeMode; label: string }[] = [
    { code: "auto", label: tr.themeAuto },
    { code: "light", label: tr.themeLight },
    { code: "dark", label: tr.themeDark },
  ];

  return (
    <div className="px-5.5 pb-6 pt-5">
      <div className="mb-3.5 font-display text-lg font-bold text-text">{tr.moreTitle}</div>

      <div className="mb-3 flex items-center gap-3 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4">
        <div
          className="flex h-[42px] w-[42px] items-center justify-center rounded-xl text-[15px] font-bold text-[#0D1311]"
          style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))" }}
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-bold text-text">{nameOrDefault}</div>
          <div className="mt-0.5 text-[11.5px] text-muted">{state.phone}</div>
        </div>
      </div>

      <div
        onClick={actions.goFaq}
        className="mb-3 flex cursor-pointer items-center justify-between rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4"
      >
        <div className="text-[13px] font-semibold text-text">{tr.faqMenuLabel}</div>
        <ChevronRight />
      </div>

      <div className="mb-3 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted">{tr.subscriptionLabel}</div>
            <div className="mt-1 text-sm font-bold text-gold">{currentPlanLabel}</div>
          </div>
          <div
            onClick={actions.goPlanManage}
            className="cursor-pointer rounded-full border border-[rgba(var(--accent-rgb),0.3)] px-3.5 py-1.5 text-[11.5px] font-semibold text-accent"
          >
            {tr.manageLabel}
          </div>
        </div>
      </div>

      <div className="mb-3 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4">
        <div className="mb-2.5 text-[10px] uppercase tracking-wide text-muted">{tr.currencyLabel}</div>
        <div className="flex flex-wrap gap-1.5">
          {CURRENCY_LIST.map((c) => (
            <Chip key={c.code} active={state.currency === c.code} wide onClick={() => actions.setCurrency(c.code)}>
              {c.code}
            </Chip>
          ))}
        </div>
        {state.currency !== "AOA" && <div className="mt-2.5 text-[10.5px] text-muted">{tr.exchangeNote}</div>}
      </div>

      <div className="mb-3 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4">
        <div className="mb-2.5 text-[10px] uppercase tracking-wide text-muted">{tr.languageLabel}</div>
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGE_LIST.map((l) => (
            <Chip key={l.code} active={state.lang === l.code} wide onClick={() => actions.setLang(l.code)}>
              {l.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mb-3 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4">
        <div className="mb-2.5 text-[10px] uppercase tracking-wide text-muted">{tr.themeLabel}</div>
        <div className="flex flex-wrap gap-1.5">
          {themeModes.map((tm) => (
            <Chip key={tm.code} active={state.themeMode === tm.code} wide onClick={() => actions.setThemeMode(tm.code)}>
              {tm.label}
            </Chip>
          ))}
        </div>
        {state.themeMode === "auto" && <div className="mt-2.5 text-[10.5px] text-muted">{tr.themeAutoHint}</div>}
      </div>

      <div className="mb-3 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-text">{tr.pushNotifLabel}</div>
          <div
            onClick={actions.toggleNotifPush}
            className="relative h-6 w-[42px] cursor-pointer rounded-full transition-colors"
            style={{ background: state.notifPush ? "var(--accent)" : "rgba(var(--border-rgb),.15)" }}
          >
            <div
              className="absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-[left]"
              style={{ left: state.notifPush ? "21px" : "3px" }}
            />
          </div>
        </div>
        <div
          onClick={actions.testNotification}
          className="cursor-pointer rounded-[10px] border border-[rgba(var(--accent-rgb),0.3)] py-2.5 text-center text-xs font-semibold text-accent"
        >
          {tr.testNotifBtn}
        </div>
      </div>

      <div className="mb-3 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4">
        <div className="mb-2.5 text-[10px] uppercase tracking-wide text-muted">{tr.remindersLabel}</div>
        {state.reminders.length > 0 ? (
          state.reminders.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-2 border-t border-[rgba(var(--border-rgb),0.06)] py-2 first:border-t-0">
              <div className="text-[12.5px] text-text">{r.text}</div>
              <div onClick={() => actions.deleteReminder(r.id)} className="cursor-pointer text-[13px] text-muted">
                ✕
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs leading-relaxed text-muted">{tr.noReminders}</div>
        )}
      </div>

      <div
        onClick={actions.generateReport}
        className="mb-4 cursor-pointer rounded-xl border border-[rgba(var(--border-rgb),0.16)] py-3.5 text-center text-[13px] font-semibold text-text"
      >
        {tr.generateReportBtn}
      </div>

      <div className="mb-2.5 text-[10px] uppercase tracking-wide text-muted">{tr.rulesLabel}</div>
      <div className="mb-4.5 flex flex-col gap-2">
        {[
          [tr.rule1Title, tr.rule1Desc],
          [tr.rule2Title, tr.rule2Desc],
          [tr.rule3Title, tr.rule3Desc],
          [tr.rule4Title, tr.rule4Desc],
          [tr.rule5Title, tr.rule5Desc],
          [tr.rule6Title, tr.rule6Desc],
        ].map(([title, desc], i) => (
          <div key={i} className="rounded-[14px] border border-[rgba(var(--border-rgb),0.08)] bg-card px-3.5 py-3.5">
            <div className="text-[12.5px] font-bold text-text">{title}</div>
            <div className="mt-1 text-[11px] leading-relaxed text-muted">{desc}</div>
          </div>
        ))}
      </div>

      <div onClick={actions.logout} className="cursor-pointer py-3.5 text-center text-[13px] font-semibold text-orange">
        {tr.logoutBtn}
      </div>
    </div>
  );
}
