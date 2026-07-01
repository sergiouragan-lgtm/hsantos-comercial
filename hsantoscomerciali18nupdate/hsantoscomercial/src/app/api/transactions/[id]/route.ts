import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const result = await prisma.transaction.deleteMany({
    where: { id: params.id, userId },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
