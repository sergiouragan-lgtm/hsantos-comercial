"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney, formatDate } from "@/lib/format";

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
}: {
  categories: Category[];
  initialTransactions: Txn[];
  currency: string;
}) {
  const router = useRouter();
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
    if (!confirm("Excluir este lançamento?")) return;
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTxns((t) => t.filter((x) => x.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="card h-fit">
        <h2 className="font-semibold">Novo lançamento</h2>
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
              💸 Gasto
            </button>
            <button
              type="button"
              onClick={() => {
                setType("INCOME");
                setCategoryId("");
              }}
              className={`btn ${type === "INCOME" ? "bg-brand-600 text-white" : "btn-ghost"}`}
            >
              💰 Receita
            </button>
          </div>
          <div>
            <label className="label">Valor</label>
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
            <label className="label">Descrição</label>
            <input
              className="input"
              placeholder="Ex.: mercado, uber..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Categoria</label>
            <select
              className="input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Automática</option>
              {filteredCats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Salvando..." : "Adicionar"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="mb-3 font-semibold">Histórico</h2>
        {txns.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhum lançamento ainda.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {txns.map((t) => (
              <li key={t.id} className="group flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.category?.emoji ?? "💸"}</span>
                  <div>
                    <p className="text-sm font-medium">
                      {t.description || t.category?.name || "Lançamento"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(t.occurredAt)} ·{" "}
                      {t.category?.name ?? "Sem categoria"} ·{" "}
                      {t.source === "WHATSAPP" ? "WhatsApp" : "Web"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      t.type === "INCOME" ? "text-brand-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {formatMoney(Number(t.amount), currency)}
                  </span>
                  <button
                    onClick={() => remove(t.id)}
                    className="text-slate-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                    title="Excluir"
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
