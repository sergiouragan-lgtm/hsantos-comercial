import { prisma } from "./prisma";
import { parseMessage } from "./parser";
import { guessCategoryName, ensureDefaultCategories } from "./categories";
import { formatMoney, startOfPeriod, STAGE_LABELS } from "./format";
import type { User } from "@prisma/client";

const HELP_TEXT = `🤖 *HSantos — Gastos & CRM*

Eu te ajudo a controlar suas finanças e seus contatos pelo WhatsApp.

💸 *Registrar gasto*
• "gastei 50 no mercado"
• "30 uber"
• "-120 farmácia"

💰 *Registrar receita*
• "recebi 2000 salário"
• "+500 venda cliente"

📊 *Consultar*
• "saldo" — saldo do mês
• "relatório" — resumo do mês
• "relatório semana" / "relatório hoje"

🤝 *CRM*
• "contato Maria 11999998888 empresa Acme"
• "leads" — listar contatos

Digite *ajuda* a qualquer momento para ver este menu.`;

/**
 * Processa uma mensagem de texto recebida de um usuário já identificado.
 * Executa a ação no banco e devolve a resposta a ser enviada no WhatsApp.
 */
export async function handleIncomingMessage(
  user: User,
  text: string
): Promise<string> {
  const intent = parseMessage(text);
  const currency = user.currency || "BRL";

  switch (intent.kind) {
    case "help":
      return HELP_TEXT;

    case "greeting":
      return `Olá, ${user.name.split(" ")[0]}! 👋\n\n${HELP_TEXT}`;

    case "transaction": {
      await ensureDefaultCategories(user.id);
      // Categorizar a partir do texto original preserva palavras-chave
      // (ex.: "venda", "uber") que a descrição limpa pode ter removido.
      const categoryName = guessCategoryName(text, intent.type);
      const category = await prisma.category.findFirst({
        where: { userId: user.id, name: categoryName, type: intent.type },
      });
      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: intent.type,
          amount: intent.amount,
          description: intent.description || null,
          categoryId: category?.id ?? null,
          source: "WHATSAPP",
        },
      });

      const emoji = intent.type === "EXPENSE" ? "💸" : "💰";
      const verbo = intent.type === "EXPENSE" ? "Gasto" : "Receita";
      const desc = intent.description ? ` em _${intent.description}_` : "";
      const cat = category ? ` ${category.emoji} ${category.name}` : "";

      const summary = await monthSummary(user, currency);
      return `${emoji} *${verbo} registrado!*\n${formatMoney(
        intent.amount,
        currency
      )}${desc}\nCategoria:${cat}\n\n${summary}`;
    }

    case "balance":
      return await monthSummary(user, currency);

    case "report":
      return await periodReport(user, intent.period, currency);

    case "add_contact": {
      const contact = await prisma.contact.create({
        data: {
          userId: user.id,
          name: intent.name,
          phone: intent.phone ?? null,
          company: intent.company ?? null,
          stage: "LEAD",
        },
      });
      const parts = [`🤝 *Contato adicionado ao CRM!*`, `👤 ${contact.name}`];
      if (contact.company) parts.push(`🏢 ${contact.company}`);
      if (contact.phone) parts.push(`📱 ${contact.phone}`);
      parts.push(`Estágio: ${STAGE_LABELS[contact.stage]}`);
      return parts.join("\n");
    }

    case "list_contacts": {
      const contacts = await prisma.contact.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 15,
      });
      if (contacts.length === 0) {
        return "📇 Você ainda não tem contatos.\nAdicione com: *contato Nome 11999998888*";
      }
      const lines = contacts.map(
        (c) =>
          `• ${c.name}${c.company ? ` (${c.company})` : ""} — ${
            STAGE_LABELS[c.stage]
          }`
      );
      return `📇 *Seus contatos* (${contacts.length})\n\n${lines.join("\n")}`;
    }

    case "unknown":
    default:
      return `Não entendi 🤔\nTente algo como "gastei 50 no mercado" ou digite *ajuda* para ver os comandos.`;
  }
}

async function monthSummary(user: User, currency: string): Promise<string> {
  const start = startOfPeriod("month");
  const txns = await prisma.transaction.findMany({
    where: { userId: user.id, occurredAt: { gte: start } },
  });
  let income = 0;
  let expense = 0;
  for (const t of txns) {
    const amount = Number(t.amount);
    if (t.type === "INCOME") income += amount;
    else expense += amount;
  }
  const balance = income - expense;
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    start
  );

  let budgetLine = "";
  if (user.monthlyBudget) {
    const budget = Number(user.monthlyBudget);
    const pct = budget > 0 ? Math.round((expense / budget) * 100) : 0;
    const bar = progressBar(pct);
    budgetLine = `\n🎯 Orçamento: ${bar} ${pct}%\n(${formatMoney(
      expense,
      currency
    )} de ${formatMoney(budget, currency)})`;
  }

  return `📊 *Resumo de ${monthName}*
💰 Receitas: ${formatMoney(income, currency)}
💸 Gastos: ${formatMoney(expense, currency)}
${balance >= 0 ? "✅" : "⚠️"} Saldo: ${formatMoney(balance, currency)}${budgetLine}`;
}

async function periodReport(
  user: User,
  period: "day" | "week" | "month",
  currency: string
): Promise<string> {
  const start = startOfPeriod(period);
  const txns = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      type: "EXPENSE",
      occurredAt: { gte: start },
    },
    include: { category: true },
  });

  const labels = { day: "hoje", week: "esta semana", month: "este mês" };
  if (txns.length === 0) {
    return `📊 Nenhum gasto registrado ${labels[period]}.`;
  }

  const byCategory = new Map<string, { total: number; emoji: string }>();
  let total = 0;
  for (const t of txns) {
    const amount = Number(t.amount);
    total += amount;
    const name = t.category?.name ?? "Outros";
    const emoji = t.category?.emoji ?? "💸";
    const cur = byCategory.get(name) ?? { total: 0, emoji };
    cur.total += amount;
    byCategory.set(name, cur);
  }

  const sorted = [...byCategory.entries()].sort(
    (a, b) => b[1].total - a[1].total
  );
  const lines = sorted.map(([name, { total: t, emoji }]) => {
    const pct = total > 0 ? Math.round((t / total) * 100) : 0;
    return `${emoji} ${name}: ${formatMoney(t, currency)} (${pct}%)`;
  });

  return `📊 *Gastos ${labels[period]}*\n\n${lines.join(
    "\n"
  )}\n\n*Total: ${formatMoney(total, currency)}*`;
}

function progressBar(pct: number): string {
  const clamped = Math.max(0, Math.min(100, pct));
  const filled = Math.round(clamped / 10);
  return "▓".repeat(filled) + "░".repeat(10 - filled);
}
