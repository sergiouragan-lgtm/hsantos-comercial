import { prisma } from "./prisma";
import { parseMessage } from "./parser";
import { guessCategoryName, ensureDefaultCategories } from "./categories";
import { formatMoney, localeFor, startOfPeriod } from "./format";
import { getStageLabels } from "./i18n/translations";
import { botStrings } from "./i18n/bot";
import type { Language } from "./i18n/config";
import type { User } from "@prisma/client";

/**
 * Processa uma mensagem de texto recebida de um usuário já identificado.
 * Executa a ação no banco e devolve a resposta a ser enviada no WhatsApp,
 * no idioma configurado pelo usuário.
 */
export async function handleIncomingMessage(
  user: User,
  text: string
): Promise<string> {
  const intent = parseMessage(text);
  const currency = user.currency || "AOA";
  const lang = (user.language as Language) || "pt";
  const strings = botStrings[lang];

  switch (intent.kind) {
    case "help":
      return strings.help;

    case "greeting":
      return strings.greeting(user.name.split(" ")[0]);

    case "set_language": {
      await prisma.user.update({
        where: { id: user.id },
        data: { language: intent.language },
      });
      return botStrings[intent.language].languageChanged;
    }

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
      const verbo = intent.type === "EXPENSE" ? strings.expenseLabel : strings.incomeLabel;
      const desc = intent.description ? ` ${strings.inWord} _${intent.description}_` : "";
      const cat = category ? ` ${category.emoji} ${category.name}` : "";

      const summary = await monthSummary(user, currency, lang);
      return `${emoji} *${verbo} ${strings.recorded}*\n${formatMoney(
        intent.amount,
        currency,
        lang
      )}${desc}\n${strings.categoryLabel}${cat}\n\n${summary}`;
    }

    case "balance":
      return await monthSummary(user, currency, lang);

    case "report":
      return await periodReport(user, intent.period, currency, lang);

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
      const stageLabels = getStageLabels(lang);
      const parts = [strings.contactAdded, `👤 ${contact.name}`];
      if (contact.company) parts.push(`🏢 ${contact.company}`);
      if (contact.phone) parts.push(`📱 ${contact.phone}`);
      parts.push(`${strings.stageLabel} ${stageLabels[contact.stage]}`);
      return parts.join("\n");
    }

    case "list_contacts": {
      const contacts = await prisma.contact.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 15,
      });
      if (contacts.length === 0) {
        return strings.noContacts;
      }
      const stageLabels = getStageLabels(lang);
      const lines = contacts.map(
        (c) => `• ${c.name}${c.company ? ` (${c.company})` : ""} — ${stageLabels[c.stage]}`
      );
      return `${strings.contactsTitle(contacts.length)}\n\n${lines.join("\n")}`;
    }

    case "unknown":
    default:
      return strings.unknown;
  }
}

async function monthSummary(user: User, currency: string, lang: Language): Promise<string> {
  const strings = botStrings[lang];
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
  const monthName = new Intl.DateTimeFormat(localeFor(lang), { month: "long" }).format(
    start
  );

  let budgetLine = "";
  if (user.monthlyBudget) {
    const budget = Number(user.monthlyBudget);
    const pct = budget > 0 ? Math.round((expense / budget) * 100) : 0;
    const bar = progressBar(pct);
    budgetLine = `\n🎯 ${strings.budgetLabel} ${bar} ${pct}%\n(${formatMoney(
      expense,
      currency,
      lang
    )} ${strings.reportTotal.replace(":", "")} ${formatMoney(budget, currency, lang)})`;
  }

  return `${strings.summaryTitle(monthName)}
💰 ${strings.income} ${formatMoney(income, currency, lang)}
💸 ${strings.expense} ${formatMoney(expense, currency, lang)}
${balance >= 0 ? "✅" : "⚠️"} ${strings.balance} ${formatMoney(balance, currency, lang)}${budgetLine}`;
}

async function periodReport(
  user: User,
  period: "day" | "week" | "month",
  currency: string,
  lang: Language
): Promise<string> {
  const strings = botStrings[lang];
  const start = startOfPeriod(period);
  const txns = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      type: "EXPENSE",
      occurredAt: { gte: start },
    },
    include: { category: true },
  });

  const labels = { day: strings.periodDay, week: strings.periodWeek, month: strings.periodMonth };
  if (txns.length === 0) {
    return strings.reportEmpty(labels[period]);
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
    return `${emoji} ${name}: ${formatMoney(t, currency, lang)} (${pct}%)`;
  });

  return `${strings.reportTitle(labels[period])}\n\n${lines.join(
    "\n"
  )}\n\n*${strings.reportTotal} ${formatMoney(total, currency, lang)}*`;
}

function progressBar(pct: number): string {
  const clamped = Math.max(0, Math.min(100, pct));
  const filled = Math.round(clamped / 10);
  return "▓".repeat(filled) + "░".repeat(10 - filled);
}
