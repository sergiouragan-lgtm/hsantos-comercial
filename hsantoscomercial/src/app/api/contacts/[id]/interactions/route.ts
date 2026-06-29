import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const owned = await prisma.contact.findFirst({
    where: { id: params.id, userId },
  });
  if (!owned) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  const interactions = await prisma.interaction.findMany({
    where: { contactId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    interactions: interactions.map((i) => ({
      id: i.id,
      type: i.type,
      content: i.content,
      dueAt: i.dueAt?.toISOString() ?? null,
      done: i.done,
      createdAt: i.createdAt.toISOString(),
    })),
  });
}

const createSchema = z.object({
  type: z.enum(["NOTE", "CALL", "MESSAGE", "MEETING", "TASK"]).optional(),
  content: z.string().min(1, "Conteúdo obrigatório"),
  dueAt: z.string().optional(),
});

export async function POST(
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
  const parsed = createSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const interaction = await prisma.interaction.create({
    data: {
      userId,
      contactId: params.id,
      type: parsed.data.type ?? "NOTE",
      content: parsed.data.content,
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
    },
  });
  // toca o updatedAt do contato
  await prisma.contact.update({
    where: { id: params.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ id: interaction.id });
}
