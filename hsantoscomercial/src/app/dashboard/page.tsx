import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney, formatDate, startOfPeriod } from "@/lib/format";
import CategoryChart from "@/components/CategoryChart";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const user = (await getCurrentUser())!;
  const currency = user.currency;
  const monthStart = startOfPeriod("month");

  const [txns, contactsCount, leadsCount, openFollowUps, recent] =
    await Promise.all([
      prisma.transaction.findMany({
        where: { userId: user.id, occurredAt: { gte: monthStart } },
        include: { category: true },
      }),
      prisma.contact.count({ where: { userId: user.id } }),
      prisma.contact.count({
        where: { userId: user.id, stage: { in: ["LEAD", "PROSPECT", "NEGOTIATION"] } },
      }),
      prisma.interaction.count({
        where: { userId: user.id, done: false, dueAt: { not: null } },
      }),
      prisma.transaction.findMany({
        where: { userId: user.id },
        include: { category: true },
        orderBy: { occurredAt: "desc" },
        take: 6,
      }),
    ]);

  let income = 0;
  let expense = 0;
  const byCategory = new Map<string, number>();
  for (const t of txns) {
    const amount = Number(t.amount);
    if (t.type === "INCOME") income += amount;
    else {
      expense += amount;
      const name = t.category?.name ?? "Outros";
      byCategory.set(name, (byCategory.get(name) ?? 0) + amount);
    }
  }
  const balance = income - expense;
  const chartData = [...byCategory.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const budget = user.monthlyBudget ? Number(user.monthlyBudget) : null;
  const budgetPct = budget && budget > 0 ? Math.round((expense / budget) * 100) : null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visão geral</h1>
          <p className="text-sm text-slate-500">
            Olá, {user.name.split(" ")[0]}! Aqui está o resumo do seu mês.
          </p>
        </div>
        <Link href="/dashboard/expenses" className="btn-primary hidden md:inline-flex">
          + Novo lançamento
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Receitas (mês)" value={formatMoney(income, currency)} tone="green" />
        <Stat label="Gastos (mês)" value={formatMoney(expense, currency)} tone="red" />
        <Stat
          label="Saldo (mês)"
          value={formatMoney(balance, currency)}
          tone={balance >= 0 ? "green" : "red"}
        />
        <Stat label="Contatos no CRM" value={String(contactsCount)} tone="brand" />
      </div>

      {budget !== null && (
        <div className="card mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Orçamento mensal</span>
            <span className="text-slate-500">
              {formatMoney(expense, currency)} de {formatMoney(budget, currency)}
            </span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                (budgetPct ?? 0) > 100 ? "bg-red-500" : "bg-brand-500"
              }`}
              style={{ width: `${Math.min(100, budgetPct ?? 0)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">{budgetPct}% utilizado</p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 font-semibold">Gastos por categoria</h2>
          <CategoryChart data={chartData} />
        </div>

        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Lançamentos recentes</h2>
            <Link href="/dashboard/expenses" className="text-sm text-brand-700">
              Ver todos
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum lançamento ainda.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{t.category?.emoji ?? "💸"}</span>
                    <div>
                      <p className="text-sm font-medium">
                        {t.description || t.category?.name || "Lançamento"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(t.occurredAt)} · {t.source === "WHATSAPP" ? "WhatsApp" : "Web"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      t.type === "INCOME" ? "text-brand-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {formatMoney(Number(t.amount), currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Leads ativos" value={String(leadsCount)} tone="brand" />
        <Stat label="Follow-ups pendentes" value={String(openFollowUps)} tone="amber" />
        <div className="card flex flex-col justify-center">
          <p className="text-sm text-slate-500">Dica</p>
          <p className="text-sm">
            Mande{" "}
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
              ajuda
            </span>{" "}
            no WhatsApp para ver todos os comandos.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "red" | "brand" | "amber";
}) {
  const tones: Record<string, string> = {
    green: "text-brand-600",
    red: "text-red-600",
    brand: "text-brand-700",
    amber: "text-amber-600",
  };
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
}
