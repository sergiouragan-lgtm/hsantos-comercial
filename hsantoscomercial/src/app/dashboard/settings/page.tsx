import { getCurrentUser } from "@/lib/auth";
import SettingsClient from "@/components/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = (await getCurrentUser())!;
  const appUrl = process.env.APP_URL || "https://seu-dominio.com";
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "hsantos-verify-token";

  return (
    <div>
      <h1 className="text-2xl font-bold">Configurações</h1>
      <p className="mb-6 text-sm text-slate-500">
        Ajuste seu perfil, orçamento e a integração com o WhatsApp.
      </p>

      <SettingsClient
        initial={{
          name: user.name,
          whatsappNumber: user.whatsappNumber ?? "",
          currency: user.currency,
          monthlyBudget: user.monthlyBudget ?? "",
        }}
      />

      <div className="card mt-6 max-w-2xl">
        <h2 className="font-semibold">Integração WhatsApp Business (Cloud API)</h2>
        <p className="mt-1 text-sm text-slate-500">
          Configure o webhook no{" "}
          <a
            className="text-brand-700 underline"
            href="https://developers.facebook.com/apps"
            target="_blank"
            rel="noreferrer"
          >
            Meta for Developers
          </a>{" "}
          com os dados abaixo.
        </p>
        <dl className="mt-4 space-y-3 text-sm">
          <ConfigRow label="Callback URL" value={`${appUrl}/api/webhook/whatsapp`} />
          <ConfigRow label="Verify Token" value={verifyToken} />
          <ConfigRow label="Campo (webhook fields)" value="messages" />
        </dl>
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          Defina as variáveis de ambiente <code>WHATSAPP_TOKEN</code>,{" "}
          <code>WHATSAPP_PHONE_NUMBER_ID</code> e{" "}
          <code>WHATSAPP_VERIFY_TOKEN</code> no servidor para que o envio e o
          recebimento de mensagens funcionem.
        </div>
      </div>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <dt className="font-medium text-slate-600">{label}</dt>
      <dd className="break-all rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
        {value}
      </dd>
    </div>
  );
}
