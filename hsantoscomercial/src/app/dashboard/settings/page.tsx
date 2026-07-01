import { getCurrentUser } from "@/lib/auth";
import SettingsClient from "@/components/SettingsClient";
import { t } from "@/lib/i18n/translations";
import type { Language } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = (await getCurrentUser())!;
  const lang = user.language as Language;
  const appUrl = process.env.APP_URL || "https://seu-dominio.com";
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "hsantos-verify-token";

  return (
    <div>
      <h1 className="text-2xl font-bold">{t(lang, "settings", "title")}</h1>
      <p className="mb-6 text-sm text-slate-500">{t(lang, "settings", "subtitle")}</p>

      <SettingsClient
        lang={lang}
        initial={{
          name: user.name,
          whatsappNumber: user.whatsappNumber ?? "",
          currency: user.currency,
          language: user.language,
          monthlyBudget: user.monthlyBudget ?? "",
        }}
      />

      <div className="card mt-6 max-w-2xl">
        <h2 className="font-semibold">{t(lang, "settings", "integrationTitle")}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {t(lang, "settings", "integrationSubtitlePre")}{" "}
          <a
            className="text-brand-700 underline"
            href="https://developers.facebook.com/apps"
            target="_blank"
            rel="noreferrer"
          >
            {t(lang, "settings", "integrationSubtitleLink")}
          </a>{" "}
          {t(lang, "settings", "integrationSubtitlePost")}
        </p>
        <dl className="mt-4 space-y-3 text-sm">
          <ConfigRow
            label={t(lang, "settings", "callbackUrl")}
            value={`${appUrl}/api/webhook/whatsapp`}
          />
          <ConfigRow label={t(lang, "settings", "verifyToken")} value={verifyToken} />
          <ConfigRow label={t(lang, "settings", "webhookField")} value="messages" />
        </dl>
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          {t(lang, "settings", "envNote")}
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
