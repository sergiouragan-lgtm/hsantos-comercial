"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsClient({
  initial,
}: {
  initial: {
    name: string;
    whatsappNumber: string;
    currency: string;
    monthlyBudget: string;
  };
}) {
  const router = useRouter();
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
        <label className="label">Nome</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Número do WhatsApp (com DDD)</label>
        <input
          className="input"
          placeholder="11999998888"
          value={form.whatsappNumber}
          onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
        />
        <p className="mt-1 text-xs text-slate-400">
          As mensagens vindas deste número serão associadas à sua conta.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Moeda</label>
          <select
            className="input"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        <div>
          <label className="label">Orçamento mensal</label>
          <input
            className="input"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={form.monthlyBudget}
            onChange={(e) =>
              setForm({ ...form, monthlyBudget: e.target.value })
            }
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Salvando..." : "Salvar"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-brand-600">✓ Salvo</span>
        )}
      </div>
    </form>
  );
}
