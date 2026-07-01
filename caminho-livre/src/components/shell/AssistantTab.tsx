"use client";

import type { KeyboardEvent } from "react";
import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { buildWhatsappText } from "@/lib/assistant";

export default function AssistantTab({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, stats, actions } = store;
  const whatsappHref = "https://wa.me/?text=" + encodeURIComponent(buildWhatsappText(tr, stats, state.currency));
  const chips = [tr.chip1, tr.chip2, tr.chip3];

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") actions.sendChat();
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-5.5 pb-2.5 pt-4.5 font-display text-[18px] font-bold text-text">{tr.tabAssistant}</div>
      <div className="flex flex-1 flex-col gap-2.5 px-4.5">
        {state.chatMessages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[14.5px] leading-relaxed"
                style={{
                  background: isUser ? "var(--accent)" : "var(--card)",
                  color: isUser ? "#0D1311" : "var(--text)",
                  borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-1.5 px-4.5 pb-1 pt-2.5">
        {chips.map((text) => (
          <div
            key={text}
            onClick={() => actions.sendChipMessage(text)}
            className="cursor-pointer rounded-full border border-[rgba(var(--accent-rgb),0.3)] px-2.5 py-1.5 text-[12.5px] text-accent"
          >
            {text}
          </div>
        ))}
      </div>
      <div className="px-4.5 pb-2.5 pt-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="block rounded-full border border-[rgba(var(--accent-rgb),0.3)] py-2 text-center text-[13.5px] font-semibold text-accent no-underline"
        >
          {tr.assistantWhatsapp}
        </a>
      </div>
      <div className="flex gap-2 px-4.5 pb-4.5">
        <input
          value={state.chatInput}
          onChange={(e) => actions.setChatInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={tr.assistantPlaceholder}
          className="min-w-0 flex-1 rounded-full border border-[rgba(var(--border-rgb),0.12)] bg-card px-3.5 py-2.5 text-[14.5px] text-text outline-none"
        />
        <div
          onClick={() => actions.sendChat()}
          className="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M4 12h16M14 6l6 6-6 6" stroke="#0D1311" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
