"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { CRM_STATUS_ORDER } from "@/lib/constants";
import type { CrmStatus } from "@/types";

const STATUS_COLOR_VAR: Record<CrmStatus, string> = {
  contact: "var(--text-muted)",
  negotiating: "var(--gold)",
  agreed: "var(--blue)",
  paid: "var(--accent)",
};
const STATUS_BG_VAR: Record<CrmStatus, string> = {
  contact: "rgba(var(--border-rgb),.10)",
  negotiating: "rgba(var(--gold-rgb),.16)",
  agreed: "rgba(var(--blue-rgb),.16)",
  paid: "rgba(var(--accent-rgb),.16)",
};

export default function CrmTab({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, money, actions } = store;

  const statusLabel: Record<CrmStatus, string> = {
    contact: tr.crmStatusContact,
    negotiating: tr.crmStatusNegotiating,
    agreed: tr.crmStatusAgreed,
    paid: tr.crmStatusPaid,
  };

  const crmStats = CRM_STATUS_ORDER.map((st) => ({
    key: st,
    count: state.debts.filter((d) => (d.crmStatus || "contact") === st).length,
    label: statusLabel[st],
    color: STATUS_COLOR_VAR[st],
  }));

  return (
    <div className="px-5.5 pb-6 pt-5">
      <div className="mb-1 font-display text-lg font-bold text-text">{tr.crmTitle}</div>
      <div className="mb-4 text-sm leading-relaxed text-muted">{tr.crmSub}</div>

      <div className="mb-4.5 grid grid-cols-2 gap-2">
        {crmStats.map((cs) => (
          <div key={cs.key} className="rounded-[14px] border border-[rgba(var(--border-rgb),0.08)] bg-card px-3 py-2.5">
            <div className="font-display text-lg font-bold" style={{ color: cs.color }}>
              {cs.count}
            </div>
            <div className="mt-0.5 text-[12.5px] text-muted">{cs.label}</div>
          </div>
        ))}
      </div>

      {state.debts.length === 0 && <div className="mb-4 text-sm leading-relaxed text-muted">{tr.crmEmptyState}</div>}

      {state.debts.map((d) => {
        const status = d.crmStatus || "contact";
        const digits = (d.phone || "").replace(/[^0-9+]/g, "").replace("+", "");
        const hasPhone = digits.length > 0;
        return (
          <div key={d.id} className="mb-3 rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-3.5">
            <div className="mb-2.5 flex items-center gap-2">
              <input
                value={d.name}
                onChange={(e) => actions.editDebt(d.id, "name", e.target.value)}
                placeholder={tr.creditorLabel}
                className="min-w-0 flex-1 rounded-[9px] border border-[rgba(var(--border-rgb),0.1)] bg-bg px-2.5 py-2.5 text-[14.5px] font-semibold text-text outline-none"
              />
              <div
                onClick={() => actions.cycleCrmStatus(d.id)}
                className="cursor-pointer whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-bold"
                style={{ background: STATUS_BG_VAR[status], color: STATUS_COLOR_VAR[status] }}
              >
                {statusLabel[status]}
              </div>
              <div
                onClick={() => actions.removeDebt(d.id)}
                className="flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-[9px] border border-[rgba(var(--border-rgb),0.1)] bg-bg text-[14.5px] text-muted"
              >
                ✕
              </div>
            </div>
            <div className="mb-2.5 font-display text-[16.5px] font-bold text-orange">{money(d.balance)}</div>
            <div className="mb-2 grid grid-cols-2 gap-1.5">
              <label className="block">
                <span className="mb-1 block text-[11.5px] text-muted">{tr.crmPhoneLabel}</span>
                <input
                  value={d.phone}
                  onChange={(e) => actions.editDebt(d.id, "phone", e.target.value)}
                  placeholder="+244…"
                  className="w-full box-border rounded-[9px] border border-[rgba(var(--border-rgb),0.1)] bg-bg px-2 py-2 text-[14.5px] text-text outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11.5px] text-muted">{tr.crmNextFollowUpLabel}</span>
                <input
                  value={d.nextFollowUp}
                  onChange={(e) => actions.editDebt(d.id, "nextFollowUp", e.target.value)}
                  className="w-full box-border rounded-[9px] border border-[rgba(var(--border-rgb),0.1)] bg-bg px-2 py-2 text-[14.5px] text-text outline-none"
                />
              </label>
            </div>
            <label className="mb-2.5 block">
              <span className="mb-1 block text-[11.5px] text-muted">{tr.crmNotesLabel}</span>
              <input
                value={d.notes}
                onChange={(e) => actions.editDebt(d.id, "notes", e.target.value)}
                placeholder={tr.notesPlaceholder}
                className="w-full box-border rounded-[9px] border border-[rgba(var(--border-rgb),0.1)] bg-bg px-2.5 py-2 text-sm text-muted outline-none"
              />
            </label>
            <div className="flex gap-2">
              {hasPhone && (
                <a
                  href={`https://wa.me/${digits}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-full border border-[rgba(var(--accent-rgb),0.3)] py-2 text-center text-[13.5px] font-semibold text-accent no-underline"
                >
                  WhatsApp
                </a>
              )}
              <div
                onClick={() => actions.addCrmReminder(d.id)}
                className="flex-1 cursor-pointer rounded-full border border-[rgba(var(--gold-rgb),0.35)] py-2 text-center text-[13.5px] font-semibold text-gold"
              >
                {tr.crmCreateReminderBtn}
              </div>
            </div>
          </div>
        );
      })}

      <div
        onClick={actions.addDebt}
        className="cursor-pointer rounded-xl border border-dashed border-[rgba(var(--border-rgb),0.2)] px-3 py-3 text-center text-[14.5px] font-semibold text-accent"
      >
        {tr.crmAddCreditor}
      </div>
    </div>
  );
}
