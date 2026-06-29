import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultCategories } from "@/lib/categories";
import ExpensesClient from "@/components/ExpensesClient";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const user = (await getCurrentUser())!;
  await ensureDefaultCategories(user.id);

  const [categories, transactions] = await Promise.all([
    prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { occurredAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Gastos</h1>
      <p className="mb-6 text-sm text-slate-500">
        Registre e acompanhe suas despesas e receitas.
      </p>
      <ExpensesClient
        currency={user.currency}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          emoji: c.emoji,
          type: c.type,
        }))}
        initialTransactions={transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: t.amount.toString(),
          description: t.description,
          category: t.category
            ? { id: t.category.id, name: t.category.name, emoji: t.category.emoji }
            : null,
          source: t.source,
          occurredAt: t.occurredAt.toISOString(),
        }))}
      />
    </div>
  );
}
