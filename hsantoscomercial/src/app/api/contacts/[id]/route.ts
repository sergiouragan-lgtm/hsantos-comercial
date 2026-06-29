import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { normalizePhone } from "@/lib/whatsapp";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().optional(),
  stage: z.enum(["LEAD", "PROSPECT", "NEGOTIATION", "CUSTOMER", "LOST"]).optional(),
  value: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const owned = await prisma.contact.findFirst({
    where: { id: params.id, userId },
  });
  if (!owned) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  const data = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { phone, email, value, ...rest } = parsed.data;
  await prisma.contact.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(phone !== undefined ? { phone: phone ? normalizePhone(phone) : null } : {}),
      ...(email !== undefined ? { email: email || null } : {}),
      ...(value !== undefined ? { value } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const result = await prisma.contact.deleteMany({
    where: { id: params.id, userId },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
