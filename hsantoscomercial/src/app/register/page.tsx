"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    whatsappNumber: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Falha ao criar conta");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-lg font-bold text-brand-700">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">H</span>
          HSantos
        </Link>
        <div className="card">
          <h1 className="text-xl font-bold">{t("register", "title")}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("register", "subtitle")}</p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="label">{t("register", "name")}</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">{t("register", "email")}</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">{t("register", "whatsapp")}</label>
              <input
                className="input"
                placeholder="11999998888"
                value={form.whatsappNumber}
                onChange={(e) => update("whatsappNumber", e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-400">{t("register", "whatsappHint")}</p>
            </div>
            <div>
              <label className="label">{t("register", "password")}</label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? t("register", "submitting") : t("register", "submit")}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          {t("register", "haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-brand-700">
            {t("register", "login")}
          </Link>
        </p>
      </div>
    </main>
  );
}
