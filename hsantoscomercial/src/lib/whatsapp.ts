// Cliente da WhatsApp Business Cloud API (Meta Graph API).
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages

const API_VERSION = process.env.WHATSAPP_API_VERSION || "v21.0";

function config() {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  return { token, phoneNumberId };
}

/** Normaliza um número para o formato E.164 sem o "+" (padrão da Cloud API). */
export function normalizePhone(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

/**
 * Envia uma mensagem de texto via WhatsApp Cloud API.
 * Em ambiente sem credenciais (dev), apenas registra no console e retorna.
 */
export async function sendText(to: string, body: string): Promise<void> {
  const { token, phoneNumberId } = config();
  const recipient = normalizePhone(to);

  if (!token || !phoneNumberId) {
    console.warn(
      `[whatsapp] credenciais ausentes — mensagem NÃO enviada para ${recipient}:\n${body}`
    );
    return;
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipient,
      type: "text",
      text: { preview_url: false, body: body.slice(0, 4096) },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error(`[whatsapp] erro ao enviar (${res.status}): ${detail}`);
    throw new Error(`Falha ao enviar mensagem no WhatsApp: ${res.status}`);
  }
}
