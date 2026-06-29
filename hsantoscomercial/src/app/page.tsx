import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const userId = await getUserId();
  if (userId) redirect("/dashboard");

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
          <Link href="/login" className="btn-ghost">
            Entrar
          </Link>
          <Link href="/register" className="btn-primary">
            Criar conta
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 text-center md:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-200">
          📲 Direto no seu WhatsApp Business
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Controle de gastos pessoais <span className="text-brand-600">+ CRM</span>,
          tudo por mensagem.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Registre despesas, acompanhe seu orçamento e gerencie seus contatos
          enviando uma simples mensagem no WhatsApp. Sem planilhas, sem apps
          extras.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/register" className="btn-primary px-6 py-3 text-base">
            Começar grátis
          </Link>
          <Link href="/login" className="btn-ghost px-6 py-3 text-base">
            Já tenho conta
          </Link>
        </div>

        <div className="mx-auto mt-14 max-w-md rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-lg">
          <div className="rounded-xl bg-[#e5ddd5] p-4">
            <Bubble side="right">gastei 45,90 no mercado</Bubble>
            <Bubble side="left">
              💸 *Gasto registrado!*{"\n"}R$ 45,90 em _mercado_{"\n"}Categoria: 🍽️
              Alimentação{"\n\n"}📊 Saldo do mês: R$ 1.240,10
            </Bubble>
            <Bubble side="right">contato Maria 11999998888 empresa Acme</Bubble>
            <Bubble side="left">
              🤝 *Contato adicionado ao CRM!*{"\n"}👤 Maria{"\n"}🏢 Acme{"\n"}📱
              11999998888
            </Bubble>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        <Feature
          emoji="💸"
          title="Gastos sem fricção"
          text="Mande 'gastei 50 no uber' e pronto. Categorização automática e relatórios prontos."
        />
        <Feature
          emoji="📊"
          title="Orçamento sob controle"
          text="Defina um teto mensal e receba seu saldo e percentual de uso a cada lançamento."
        />
        <Feature
          emoji="🤝"
          title="CRM integrado"
          text="Cadastre leads, acompanhe estágios do funil e organize follow-ups — tudo no mesmo lugar."
        />
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} HSantos Comercial — Gastos & CRM via WhatsApp
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
