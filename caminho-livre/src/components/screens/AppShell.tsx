"use client";

import type { CaminhoLivreStore } from "@/hooks/useCaminhoLivre";
import BottomNav from "@/components/shell/BottomNav";
import HomeTab from "@/components/shell/HomeTab";
import DebtsTab from "@/components/shell/DebtsTab";
import CrmTab from "@/components/shell/CrmTab";
import BudgetTab from "@/components/shell/BudgetTab";
import AssistantTab from "@/components/shell/AssistantTab";
import MoreTab from "@/components/shell/MoreTab";

export default function AppShell({ store }: { store: CaminhoLivreStore }) {
  const { state } = store;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        {state.tab === "inicio" && <HomeTab store={store} />}
        {state.tab === "dividas" && <DebtsTab store={store} />}
        {state.tab === "crm" && <CrmTab store={store} />}
        {state.tab === "orcamento" && <BudgetTab store={store} />}
        {state.tab === "assistente" && <AssistantTab store={store} />}
        {state.tab === "mais" && <MoreTab store={store} />}
      </div>
      <BottomNav store={store} />
    </div>
  );
}
