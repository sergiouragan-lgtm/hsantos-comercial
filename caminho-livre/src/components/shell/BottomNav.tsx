"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import type { Tab } from "@/types";

const ICONS: Record<Tab, JSX.Element> = {
  inicio: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 11.5L12 4.5L20 11.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10V19.5H18V10" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
    </svg>
  ),
  dividas: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="3.4" rx="1" fill="currentColor" />
      <rect x="4" y="10.3" width="16" height="3.4" rx="1" fill="currentColor" />
      <rect x="4" y="15.6" width="10" height="3.4" rx="1" fill="currentColor" />
    </svg>
  ),
  crm: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2.2" stroke="currentColor" strokeWidth={1.8} />
      <circle cx="9" cy="11" r="2.1" stroke="currentColor" strokeWidth={1.6} />
      <path d="M6 16c0-1.7 1.4-2.6 3-2.6s3 .9 3 2.6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M14.5 10h3M14.5 13h3" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  ),
  orcamento: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="6.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth={1.8} />
      <circle cx="16" cy="13" r="1.6" fill="currentColor" />
    </svg>
  ),
  assistente: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6.5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 3.5v-3.5H6a2 2 0 01-2-2v-8z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  ),
  mais: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="18" cy="12" r="1.7" fill="currentColor" />
    </svg>
  ),
};

export default function BottomNav({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, actions } = store;
  const items: { tab: Tab; label: string }[] = [
    { tab: "inicio", label: tr.tabHome },
    { tab: "dividas", label: tr.tabDebts },
    { tab: "crm", label: "CRM" },
    { tab: "orcamento", label: tr.tabBudget },
    { tab: "assistente", label: tr.tabAssistant },
    { tab: "mais", label: tr.tabMore },
  ];

  return (
    <div className="flex shrink-0 items-stretch border-t border-[rgba(var(--border-rgb),0.08)] bg-navbg">
      {items.map((item) => {
        const active = state.tab === item.tab;
        return (
          <div
            key={item.tab}
            onClick={() => actions.goTab(item.tab)}
            className="flex flex-1 cursor-pointer flex-col items-center gap-1 py-2.5 pb-2"
            style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
          >
            {ICONS[item.tab]}
            <div className="text-[9.5px] font-semibold">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
