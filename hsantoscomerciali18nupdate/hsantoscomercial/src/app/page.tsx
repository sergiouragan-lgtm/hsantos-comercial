import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLanguage } from "@/lib/i18n/server";
import { t, translations } from "@/lib/i18n/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type LandingKey = keyof (typeof translations)["pt"]["landing"];

export default async function LandingPage() {
  const userId = await getUserId();
  if (userId) redirect("/dashboard");

  const lang = getLanguage();
  const tt = (key: LandingKey) => t(lang, "landing", key);

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 text-lg font-bold text-brand-700">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            H
          </span>
          HSantos
        </div>
        <nav className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login" className="btn-ghost">
            {t(lang, "nav", "login")}
          </Link>
          <Link href="/register" className="btn-primary">
            {t(lang, "nav", "register")}
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 text-center md:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-200">
          {tt("badge")}
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          {tt("titlePre")} <span className="text-brand-600">{tt("titleHighlight")}</span>
          {tt("titlePost")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">{tt("subtitle")}</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/register" className="btn-primary px-6 py-3 text-base">
            {tt("ctaPrimary")}
          </Link>
          <Link href="/login" className="btn-ghost px-6 py-3 text-base">
            {tt("ctaSecondary")}
          </Link>
        </div>

        <div className="mx-auto mt-14 max-w-md rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-lg">
          <div className="rounded-xl bg-[#e5ddd5] p-4">
            <Bubble side="right">{tt("chat1")}</Bubble>
            <Bubble side="left">{tt("chat2")}</Bubble>
            <Bubble side="right">{tt("chat3")}</Bubble>
            <Bubble side="left">{tt("chat4")}</Bubble>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        <Feature emoji="💸" title={tt("feature1Title")} text={tt("feature1Text")} />
        <Feature emoji="📊" title={tt("feature2Title")} text={tt("feature2Text")} />
        <Feature emoji="🤝" title={tt("feature3Title")} text={tt("feature3Text")} />
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {tt("footer")}
      </footer>
    </main>
  );
}

function Feature({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="card">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function Bubble({
  side,
  children,
}: {
  side: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div className={`mb-2 flex ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] whitespace-pre-line rounded-lg px-3 py-2 text-sm shadow ${
          side === "right" ? "bg-brand-100 text-slate-800" : "bg-white text-slate-800"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
