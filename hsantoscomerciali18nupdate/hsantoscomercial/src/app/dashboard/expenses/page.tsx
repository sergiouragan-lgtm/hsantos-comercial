import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultCategories } from "@/lib/categories";
import ExpensesClient from "@/components/ExpensesClient";
import { t } from "@/lib/i18n/translations";
import type { Language } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const user = (await getCurrentUser())!;
  const lang = user.language as Language;
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
      <h1 className="text-2xl font-bold">{t(lang, "expenses", "title")}</h1>
      <p className="mb-6 text-sm text-slate-500">{t(lang, "expenses", "subtitle")}</p>
      <ExpensesClient
        lang={lang}
        currency={user.currency}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          emoji: c.emoji,
          type: c.type,
        }))}
        initialTransactions={transactions.map((tx) => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount.toString(),
          description: tx.description,
          category: tx.category
            ? { id: tx.category.id, name: tx.category.name, emoji: tx.category.emoji }
            : null,
          source: tx.source,
          occurredAt: tx.occurredAt.toISOString(),
        }))}
      />
    </div>
  );
}
