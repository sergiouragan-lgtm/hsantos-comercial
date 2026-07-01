import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { LANGUAGE_COOKIE, SUPPORTED_LANGUAGES } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

const schema = z.object({
  language: z.enum(SUPPORTED_LANGUAGES),
});

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Idioma inválido" }, { status: 400 });
  }

  cookies().set(LANGUAGE_COOKIE, parsed.data.language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  const userId = await getUserId();
  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { language: parsed.data.language },
    });
  }

  return NextResponse.json({ ok: true });
}
