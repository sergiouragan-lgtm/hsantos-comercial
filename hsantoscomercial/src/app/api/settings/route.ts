import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { normalizePhone } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().min(2).optional(),
  whatsappNumber: z.string().optional(),
  currency: z.string().min(3).max(3).optional(),
  monthlyBudget: z.coerce.number().nonnegative().optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { name, whatsappNumber, currency, monthlyBudget } = parsed.data;
  const normalized = whatsappNumber ? normalizePhone(whatsappNumber) : undefined;

  if (normalized) {
    const taken = await prisma.user.findUnique({
      where: { whatsappNumber: normalized },
    });
    if (taken && taken.id !== userId) {
      return NextResponse.json(
        { error: "Este número de WhatsApp já está em uso" },
        { status: 409 }
      );
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(whatsappNumber !== undefined
        ? { whatsappNumber: normalized || null }
        : {}),
      ...(currency !== undefined ? { currency } : {}),
      ...(monthlyBudget !== undefined ? { monthlyBudget } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
