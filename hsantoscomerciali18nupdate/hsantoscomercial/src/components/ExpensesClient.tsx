"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney, formatDate } from "@/lib/format";
import { t, translations } from "@/lib/i18n/translations";
import type { Language } from "@/lib/i18n/config";

type ExpensesKey = keyof (typeof translations)["pt"]["expenses"];

type Category = { id: string; name: string; emoji: string; type: string };
type Txn = {
  id: string;
  type: "EXPENSE" | "INCOME";
  amount: string;
  description: string | null;
  category: { id: string; name: string; emoji: string } | null;
  source: string;
  occurredAt: string;
};

export default function ExpensesClient({
  categories,
  initialTransactions,
  currency,
  lang,
}: {
  categories: Category[];
  initialTransactions: Txn[];
  currency: string;
  lang: Language;
}) {
  const router = useRouter();
  const tt = (key: ExpensesKey) => t(lang, "expenses", key);
  const [txns, setTxns] = useState<Txn[]>(initialTransactions);
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredCats = categories.filter((c) => c.type === type);

  async function refresh() {
    const res = await fetch("/api/transactions");
    if (res.ok) {
      const data = await res.json();
      setTxns(data.transactions);
    }
    router.refresh();
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        amount,
        description,
        categoryId: categoryId || undefined,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setAmount("");
      setDescription("");
      setCategoryId("");
      await refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao salvar");
    }
  }

  async function remove(id: string) {
    if (!confirm(tt("deleteConfirm"))) return;
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTxns((prev) => prev.filter((x) => x.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="card h-fit">
        <h2 className="font-semibold">{tt("formTitle")}</h2>
        <form onSubmit={add} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setType("EXPENSE");
                setCategoryId("");
              }}
              className={`btn ${type === "EXPENSE" ? "bg-red-600 text-white" : "btn-ghost"}`}
            >
              {tt("expenseBtn")}
            </button>
            <button
              type="button"
              onClick={() => {
                setType("INCOME");
                setCategoryId("");
              }}
              className={`btn ${type === "INCOME" ? "bg-brand-600 text-white" : "btn-ghost"}`}
            >
              {tt("incomeBtn")}
            </button>
          </div>
          <div>
            <label className="label">{tt("amountLabel")}</label>
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">{tt("descriptionLabel")}</label>
            <input
              className="input"
              placeholder={tt("descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{tt("categoryLabel")}</label>
            <select
              className="input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">{tt("categoryAuto")}</option>
              {filteredCats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? tt("addingBtn") : tt("addBtn")}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="mb-3 font-semibold">{tt("historyTitle")}</h2>
        {txns.length === 0 ? (
          <p className="text-sm text-slate-400">{tt("empty")}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {txns.map((tx) => (
              <li key={tx.id} className="group flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tx.category?.emoji ?? "💸"}</span>
                  <div>
                    <p className="text-sm font-medium">
                      {tx.description || tx.category?.name || tt("entryFallback")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(tx.occurredAt, lang)} ·{" "}
                      {tx.category?.name ?? tt("noCategory")} ·{" "}
                      {tx.source === "WHATSAPP" ? tt("sourceWhatsapp") : tt("sourceWeb")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === "INCOME" ? "text-brand-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {formatMoney(Number(tx.amount), currency, lang)}
                  </span>
                  <button
                    onClick={() => remove(tx.id)}
                    className="text-slate-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
