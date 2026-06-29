import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleIncomingMessage } from "@/lib/conversation";
import { sendText, normalizePhone } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// GET — verificação do webhook (handshake da Meta).
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// ---------------------------------------------------------------------------
// POST — recebimento de mensagens.
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    const entries = payload?.entry ?? [];
    for (const entry of entries) {
      const changes = entry?.changes ?? [];
      for (const change of changes) {
        const value = change?.value;
        const messages = value?.messages ?? [];
        const metadata = value?.metadata ?? {};
        const businessNumber = metadata?.display_phone_number || "";

        for (const message of messages) {
          await processMessage(message, businessNumber);
        }
      }
    }
  } catch (err) {
    console.error("[webhook] erro ao processar:", err);
  }

  // A Meta exige 200 rápido — sempre confirmamos o recebimento.
  return NextResponse.json({ ok: true });
}

async function processMessage(message: any, businessNumber: string) {
  const from = normalizePhone(message?.from ?? "");
  const waMessageId = message?.id as string | undefined;
  if (!from) return;

  // Apenas mensagens de texto neste MVP.
  const body: string | undefined =
    message?.type === "text" ? message?.text?.body : undefined;

  // Identifica o tenant pelo número do remetente.
  const user = await prisma.user.findUnique({
    where: { whatsappNumber: from },
  });

  // Log de entrada.
  await prisma.whatsappMessage.create({
    data: {
      userId: user?.id ?? null,
      direction: "IN",
      waMessageId: waMessageId ?? null,
      from,
      to: businessNumber,
      body: body ?? null,
      payload: message,
    },
  });

  if (!user) {
    await reply(
      from,
      businessNumber,
      null,
      `Olá! 👋 Este número ainda não está vinculado a uma conta HSantos.\n\nCrie sua conta em ${
        process.env.APP_URL || "nosso site"
      } e cadastre este número de WhatsApp nas configurações para começar a registrar seus gastos.`
    );
    return;
  }

  if (!body) {
    await reply(
      from,
      businessNumber,
      user.id,
      "Por enquanto só consigo entender mensagens de texto 🙂\nDigite *ajuda* para ver os comandos."
    );
    return;
  }

  const answer = await handleIncomingMessage(user, body);
  await reply(from, businessNumber, user.id, answer);
}

async function reply(
  to: string,
  from: string,
  userId: string | null,
  text: string
) {
  await prisma.whatsappMessage.create({
    data: {
      userId,
      direction: "OUT",
      from,
      to,
      body: text,
    },
  });
  await sendText(to, text);
}
