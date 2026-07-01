"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import { ErrorText, PrimaryButton, TextField } from "@/components/ui/atoms";

export default function SignupScreen({ store }: { store: CaminhoLivreStore }) {
  const { state, tr, actions } = store;

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-8">
        <h1 className="m-0 font-display text-[22px] font-bold text-text">{tr.signupTitle}</h1>
        <p className="my-1.5 mb-5 text-[13px] text-muted">{tr.signupSub}</p>
      </div>
      <div className="flex-1 overflow-auto px-6">
        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">{tr.nameLabel}</span>
          <TextField value={state.name} onChange={(e) => actions.setName(e.target.value)} />
        </label>
        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">{tr.phoneLabel}</span>
          <TextField value={state.phone} onChange={(e) => actions.setPhone(e.target.value)} placeholder="+244 9XX XXX XXX" />
        </label>
        <label className="mb-2.5 block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">{tr.passwordLabel}</span>
          <TextField type="password" value={state.password} onChange={(e) => actions.setPassword(e.target.value)} />
        </label>
        {state.signupError && <ErrorText>{tr.fillAllFields}</ErrorText>}
      </div>
      <div className="px-6 py-4">
        <PrimaryButton onClick={actions.doSignupContinue}>{tr.continueBtn}</PrimaryButton>
      </div>
      <div className="px-6 pb-5.5 text-center">
        <span onClick={actions.goLogin} className="cursor-pointer text-[12.5px] font-semibold text-accent">
          {tr.alreadyHaveAccount}
        </span>
      </div>
    </div>
  );
}
