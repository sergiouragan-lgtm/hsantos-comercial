"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Falha ao entrar");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-lg font-bold text-brand-700">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">H</span>
          HSantos
        </Link>
        <div className="card">
          <h1 className="text-xl font-bold">Entrar</h1>
          <p className="mt-1 text-sm text-slate-500">Acesse seu painel de gastos e CRM.</p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="label">E-mail</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Senha</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          Não tem conta?{" "}
          <Link href="/register" className="font-semibold text-brand-700">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
