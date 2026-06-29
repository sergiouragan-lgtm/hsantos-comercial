import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { ensureDefaultCategories, guessCategoryName } from "@/lib/categories";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { occurredAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    transactions: transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: t.amount.toString(),
      description: t.description,
      category: t.category
        ? { id: t.category.id, name: t.category.name, emoji: t.category.emoji }
        : null,
      source: t.source,
      occurredAt: t.occurredAt.toISOString(),
    })),
  });
}

const createSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z.coerce.number().positive("Valor deve ser positivo"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  occurredAt: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const data = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  await ensureDefaultCategories(userId);
  let categoryId = parsed.data.categoryId;
  if (!categoryId) {
    const name = guessCategoryName(parsed.data.description ?? "", parsed.data.type);
    const cat = await prisma.category.findFirst({
      where: { userId, name, type: parsed.data.type },
    });
    categoryId = cat?.id;
  }

  const txn = await prisma.transaction.create({
    data: {
      userId,
      type: parsed.data.type,
      amount: parsed.data.amount,
      description: parsed.data.description || null,
      categoryId: categoryId ?? null,
      source: "WEB",
      occurredAt: parsed.data.occurredAt ? new Date(parsed.data.occurredAt) : new Date(),
    },
  });

  return NextResponse.json({ id: txn.id });
}
