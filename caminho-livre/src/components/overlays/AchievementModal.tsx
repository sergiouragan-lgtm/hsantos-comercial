"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";

const CONFETTI = [
  { left: "14%", size: 8, color: "var(--accent)", anim: "animate-cl-confetti-1" },
  { left: "28%", size: 7, color: "var(--gold)", anim: "animate-cl-confetti-2" },
  { left: "42%", size: 8, color: "var(--orange)", anim: "animate-cl-confetti-3" },
  { left: "56%", size: 6, color: "var(--accent)", anim: "animate-cl-confetti-4" },
  { left: "70%", size: 8, color: "var(--gold)", anim: "animate-cl-confetti-5" },
  { left: "84%", size: 7, color: "#EAF3EE", anim: "animate-cl-confetti-6" },
];

export default function AchievementModal({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, actions } = store;
  if (!state.showAchievement) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
      <div className="relative w-[280px] overflow-hidden rounded-[20px] border border-[rgba(var(--gold-rgb),0.35)] bg-card p-7 text-center animate-cl-modal-in">
        {CONFETTI.map((c, i) => (
          <div
            key={i}
            className={`absolute top-0 ${c.anim}`}
            style={{ left: c.left, width: c.size, height: c.size, background: c.color }}
          />
        ))}
        <div className="mx-auto mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[rgba(var(--gold-rgb),0.15)]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.5c1 3 4 4 4 8a4 4 0 11-8 0c0-1.3.5-2.2 1.1-3 .2 1 .9 1.6 1.4 1.2-.4-2 .3-4 1.5-6.2z"
              fill="var(--gold)"
            />
          </svg>
        </div>
        <div className="font-display text-[19px] font-bold text-text">{tr.congrats}</div>
        <div className="mt-2 text-[12.5px] leading-relaxed text-muted">{tr.congratsMsg}</div>
        <div
          onClick={actions.closeAchievement}
          className="mt-4.5 cursor-pointer rounded-[11px] bg-accent py-2.5 text-[13px] font-bold text-[#0D1311]"
        >
          {tr.closeWord}
        </div>
      </div>
    </div>
  );
}
