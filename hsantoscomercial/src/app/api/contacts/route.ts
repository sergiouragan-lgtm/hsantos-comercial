import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { normalizePhone } from "@/lib/whatsapp";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      interactions: {
        where: { done: false, dueAt: { not: null } },
        orderBy: { dueAt: "asc" },
        take: 1,
      },
    },
  });

  return NextResponse.json({
    contacts: contacts.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      company: c.company,
      stage: c.stage,
      value: c.value ? c.value.toString() : null,
      notes: c.notes,
      nextFollowUp: c.interactions[0]?.dueAt?.toISOString() ?? null,
      updatedAt: c.updatedAt.toISOString(),
    })),
  });
}

const createSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  company: z.string().optional(),
  stage: z.enum(["LEAD", "PROSPECT", "NEGOTIATION", "CUSTOMER", "LOST"]).optional(),
  value: z.coerce.number().optional(),
  notes: z.string().optional(),
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

  const contact = await prisma.contact.create({
    data: {
      userId,
      name: parsed.data.name,
      phone: parsed.data.phone ? normalizePhone(parsed.data.phone) : null,
      email: parsed.data.email || null,
      company: parsed.data.company || null,
      stage: parsed.data.stage ?? "LEAD",
      value: parsed.data.value ?? null,
      notes: parsed.data.notes || null,
    },
  });

  return NextResponse.json({ id: contact.id });
}
