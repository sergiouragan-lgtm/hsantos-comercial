"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { BackChevron } from "@/components/ui/atoms";

export default function FaqScreen({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, actions } = store;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5.5 pt-5">
        <BackChevron onClick={actions.backFromFaq} />
        <div>
          <div className="font-display text-lg font-bold text-text">{tr.faqTitle}</div>
          <div className="mt-0.5 text-[11.5px] text-muted">{tr.faqSub}</div>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-5.5 pb-6 pt-4.5">
        {(tr.faqItems || []).map((item, i) => {
          const isOpen = state.faqOpenIndex === i;
          return (
            <div
              key={i}
              onClick={() => actions.toggleFaq(i)}
              className="mb-2.5 cursor-pointer rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card px-4 py-3.5"
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="text-[13.5px] font-semibold text-text">{item.q}</div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 transition-transform"
                  style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                  <path d="M9 5l7 7-7 7" stroke="var(--accent)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {isOpen && <div className="mt-2.5 text-[12.5px] leading-relaxed text-muted">{item.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
