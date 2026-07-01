"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";

export default function Toast({ store }: { store: CaminhoLivreStore }) {
  const { state } = store;
  if (!state.showToast) return null;

  return (
    <div className="absolute bottom-[90px] left-5 right-5 z-30 rounded-xl bg-[#EAF3EE] px-3 py-2.5 text-center text-sm font-semibold text-[#0D1311] animate-cl-fade-in">
      {state.toastMsg}
    </div>
  );
}
