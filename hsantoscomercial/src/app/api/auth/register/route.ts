import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { ensureDefaultCategories } from "@/lib/categories";
import { normalizePhone } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  whatsappNumber: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;
  const whatsappNumber = parsed.data.whatsappNumber
    ? normalizePhone(parsed.data.whatsappNumber)
    : null;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Já existe uma conta com este e-mail" },
      { status: 409 }
    );
  }

  if (whatsappNumber) {
    const phoneTaken = await prisma.user.findUnique({
      where: { whatsappNumber },
    });
    if (phoneTaken) {
      return NextResponse.json(
        { error: "Este número de WhatsApp já está em uso" },
        { status: 409 }
      );
    }
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, whatsappNumber },
  });
  await ensureDefaultCategories(user.id);
  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
