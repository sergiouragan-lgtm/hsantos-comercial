"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { LANGUAGE_LIST } from "@/lib/constants";
import { ErrorText, PrimaryButton, TextField } from "@/components/ui/atoms";

export default function LoginScreen({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, actions } = store;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap justify-center gap-1.5 px-5 pt-3.5">
        {LANGUAGE_LIST.map((l) => {
          const active = state.lang === l.code;
          return (
            <div
              key={l.code}
              onClick={() => actions.setLang(l.code)}
              className={`cursor-pointer rounded-full px-2.5 py-1.5 text-[11px] font-bold ${
                active ? "bg-accent text-[#0D1311]" : "border border-[rgba(var(--border-rgb),0.1)] bg-card font-semibold text-muted"
              }`}
            >
              {l.code.toUpperCase()}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center px-6 pt-4">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[rgba(var(--accent-rgb),0.35)] bg-[rgba(var(--accent-rgb),0.12)] shadow-[0_0_24px_rgba(var(--accent-rgb),0.22)]">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path d="M5 21C10 21 9 7 16 7C20 7 22 10 23 13" stroke="var(--accent)" strokeWidth={2.4} strokeLinecap="round" />
            <circle cx="23" cy="13" r="2.6" fill="var(--accent)" />
          </svg>
        </div>
        <div className="mt-2.5 font-display text-base font-bold text-text">Caminho Livre</div>
        <div className="mt-1 text-center text-[11.5px] text-muted">{tr.tagline}</div>
      </div>

      <div className="flex-1 overflow-auto px-6 pt-5">
        <h1 className="m-0 font-display text-[22px] font-bold text-text">{tr.welcomeBack}</h1>
        <p className="my-1.5 mb-5 text-[13px] leading-relaxed text-muted">{tr.loginSub}</p>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">{tr.phoneLabel}</span>
          <TextField value={state.phone} onChange={(e) => actions.setPhone(e.target.value)} placeholder="+244 9XX XXX XXX" />
        </label>
        <label className="mb-2 block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">{tr.passwordLabel}</span>
          <TextField type="password" value={state.password} onChange={(e) => actions.setPassword(e.target.value)} />
        </label>

        {state.loginError && <ErrorText>{tr.fillAllFields}</ErrorText>}

        <div className="mb-5 flex justify-end">
          <span className="cursor-pointer text-[12.5px] font-semibold text-accent">{tr.forgotPassword}</span>
        </div>

        <PrimaryButton onClick={actions.doLogin}>{tr.enterBtn}</PrimaryButton>

        <div className="my-5 flex items-center gap-2.5">
          <div className="h-px flex-1 bg-[rgba(var(--border-rgb),0.12)]" />
          <div className="text-[11.5px] text-muted">{tr.orWord}</div>
          <div className="h-px flex-1 bg-[rgba(var(--border-rgb),0.12)]" />
        </div>

        <div
          onClick={actions.goSignup}
          className="cursor-pointer rounded-xl border border-[rgba(var(--border-rgb),0.18)] px-3.5 py-[13px] text-center text-sm font-semibold text-text"
        >
          {tr.createAccount}
        </div>
      </div>

      <div className="px-6 pb-5 pt-3.5 text-center text-[10.5px] text-muted">{tr.dataPrivacy}</div>
    </div>
  );
}
