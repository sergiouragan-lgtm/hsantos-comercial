"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t, translations } from "@/lib/i18n/translations";
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/config";

type SettingsKey = keyof (typeof translations)["pt"]["settings"];

export default function SettingsClient({
  initial,
  lang,
}: {
  initial: {
    name: string;
    whatsappNumber: string;
    currency: string;
    language: string;
    monthlyBudget: string;
  };
  lang: Language;
}) {
  const router = useRouter();
  const tt = (key: SettingsKey) => t(lang, "settings", key);
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        whatsappNumber: form.whatsappNumber,
        currency: form.currency,
        language: form.language,
        monthlyBudget: form.monthlyBudget ? Number(form.monthlyBudget) : null,
      }),
    });
    if (res.ok) {
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao salvar");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={save} className="card max-w-lg space-y-4">
      <div>
        <label className="label">{tt("nameLabel")}</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{tt("whatsappLabel")}</label>
        <input
          className="input"
          placeholder="11999998888"
          value={form.whatsappNumber}
          onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
        />
        <p className="mt-1 text-xs text-slate-400">{tt("whatsappHint")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{tt("currencyLabel")}</label>
          <select
            className="input"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            <option value="AOA">Kwanza (AOA)</option>
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        <div>
          <label className="label">{tt("languageLabel")}</label>
          <select
            className="input"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          >
            {SUPPORTED_LANGUAGES.map((code) => (
              <option key={code} value={code}>
                {LANGUAGE_LABELS[code]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">{tt("budgetLabel")}</label>
        <input
          className="input"
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          value={form.monthlyBudget}
          onChange={(e) => setForm({ ...form, monthlyBudget: e.target.value })}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={status === "saving"}>
          {status === "saving" ? tt("saving") : tt("save")}
        </button>
        {status === "saved" && (
          <span className="text-sm text-brand-600">{tt("saved")}</span>
        )}
      </div>
    </form>
  );
}
