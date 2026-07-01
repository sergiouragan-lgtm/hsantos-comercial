// Parser leve de linguagem natural para comandos do WhatsApp (multilíngue:
// pt/en/fr/ar/zh para os comandos fixos; texto livre de valor/descrição
// continua majoritariamente orientado a pt-BR).
// Não usa LLM — heurísticas/regex suficientes para os fluxos do MVP.

import { TransactionType } from "@prisma/client";
import { LANGUAGE_COMMAND_WORDS, LANGUAGE_NAME_MAP } from "./i18n/bot";
import type { Language } from "./i18n/config";

export type ParsedIntent =
  | { kind: "help" }
  | { kind: "greeting" }
  | { kind: "balance" }
  | { kind: "report"; period: "day" | "week" | "month" }
  | { kind: "list_contacts" }
  | { kind: "set_language"; language: Language }
  | {
      kind: "transaction";
      type: TransactionType;
      amount: number;
      description: string;
    }
  | {
      kind: "add_contact";
      name: string;
      phone?: string;
      company?: string;
    }
  | { kind: "unknown"; text: string };

const HELP_WORDS = ["ajuda", "help", "aide", "menu", "comandos", "مساعدة", "帮助", "?"];
const GREETING_WORDS = [
  "oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "eai", "e ai",
  "hi", "hello", "hey",
  "bonjour", "salut", "coucou",
  "مرحبا", "أهلا", "السلام عليكم",
  "你好", "您好", "嗨",
];
const BALANCE_WORDS = [
  "saldo", "quanto tenho", "balanço", "balanco",
  "balance", "how much do i have",
  "solde",
  "الرصيد", "رصيد",
  "余额",
];
const REPORT_WORDS = ["relatorio", "relatório", "resumo", "extrato", "report", "rapport", "تقرير", "报表", "报告"];
const CONTACTS_LIST_WORDS = ["contatos", "leads", "crm", "clientes", "contacts", "contacts", "جهات الاتصال", "联系人列表", "客户列表"];
const ADD_CONTACT_PREFIXES = ["contato", "lead", "cliente", "novo lead", "novo contato", "contact", "new contact", "جهة اتصال", "联系人", "新联系人"];

// Palavras que indicam receita (entrada de dinheiro).
const INCOME_WORDS = [
  "recebi", "receita", "ganhei", "entrou", "salario", "salário", "vendi", "venda",
  "received", "income", "sold", "sale",
  "reçu", "revenu", "vendu", "vente",
  "استلمت", "دخل", "بعت",
  "收到", "收入", "卖了",
];
// Palavras que indicam despesa.
const EXPENSE_WORDS = [
  "gastei", "paguei", "comprei", "gasto", "despesa", "saiu",
  "spent", "paid", "bought", "expense",
  "dépensé", "payé", "acheté", "dépense",
  "صرفت", "دفعت", "اشتريت", "مصروف",
  "花了", "支付", "买了",
];

function extractAmount(text: string): number | null {
  // Aceita "50", "2000", "50,90", "1.250,00", "1.250", "R$ 30", "30 reais".
  // 1ª alternativa: número com separador de milhar (exige ao menos um grupo .NNN).
  // 2ª alternativa: número simples, com casa decimal opcional (.,).
  const match = text.match(
    /(?:r\$\s*)?(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i
  );
  if (!match) return null;
  let raw = match[1];
  // Normaliza separadores pt-BR.
  if (raw.includes(",")) {
    // vírgula = decimal; ponto = milhar
    raw = raw.replace(/\./g, "").replace(",", ".");
  } else {
    // só pontos: se o último grupo tem 3 dígitos, são separadores de milhar.
    const decimal = raw.match(/\.(\d+)$/);
    if (decimal && decimal[1].length === 3) {
      raw = raw.replace(/\./g, "");
    }
  }
  const value = parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

// \b padrão do JS só reconhece [A-Za-z0-9_] como "palavra", então falha em
// fronteiras com letras acentuadas (ex.: o final de "dépensé"). Usamos
// lookaround Unicode-aware (\p{L}) para funcionar em pt/fr/etc.
function wordBoundaryRegex(words: string[]): RegExp {
  const alternation = words.join("|");
  return new RegExp(`(?<![\\p{L}\\p{N}_])(${alternation})(?![\\p{L}\\p{N}_])`, "giu");
}

const CONNECTOR_WORDS = ["no", "na", "nos", "nas", "de", "do", "da", "com", "em", "on", "for", "en", "pour", "على", "في", "在", "于"];
const VERB_WORDS = [
  "gastei", "paguei", "comprei", "gasto", "despesa",
  "recebi", "receita", "ganhei", "entrou", "vendi", "venda",
  "spent", "paid", "bought", "expense", "received", "income", "sold", "sale",
  "dépensé", "payé", "acheté", "dépense", "reçu", "revenu", "vendu", "vente",
  "صرفت", "دفعت", "اشتريت", "مصروف", "استلمت", "دخل", "بعت",
  "花了", "支付", "买了", "收到", "收入", "卖了",
];

function cleanDescription(text: string, amount: number): string {
  let desc = text
    // remove números/moeda relativos ao valor
    .replace(/r\$\s*/gi, "")
    .replace(/\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?/g, " ")
    .replace(wordBoundaryRegex(["reais?"]), " ")
    .replace(wordBoundaryRegex(CONNECTOR_WORDS), " ")
    .replace(wordBoundaryRegex(VERB_WORDS), " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!desc) desc = "";
  // Capitaliza a primeira letra.
  return desc.charAt(0).toUpperCase() + desc.slice(1);
}

function extractPhone(text: string): string | undefined {
  const match = text.match(/(\+?\d[\d\s().-]{8,}\d)/);
  if (!match) return undefined;
  const digits = match[1].replace(/[^\d]/g, "");
  return digits.length >= 10 ? digits : undefined;
}

export function parseMessage(input: string): ParsedIntent {
  const text = input.trim();
  const lower = text.toLowerCase();

  if (!text) return { kind: "unknown", text };

  // Troca de idioma: "idioma english", "language pt", "langue fr", "لغة ar", "语言 中文"
  for (const cmd of LANGUAGE_COMMAND_WORDS) {
    if (lower.startsWith(cmd.toLowerCase())) {
      const rest = text.slice(cmd.length).trim().toLowerCase().replace(/[^\p{L}]+/gu, "");
      const language = LANGUAGE_NAME_MAP[rest];
      if (language) return { kind: "set_language", language };
    }
  }

  // Comandos diretos
  if (HELP_WORDS.some((w) => lower === w || lower.startsWith(w + " "))) {
    return { kind: "help" };
  }
  if (GREETING_WORDS.some((w) => lower === w)) {
    return { kind: "greeting" };
  }
  if (BALANCE_WORDS.some((w) => lower.includes(w))) {
    return { kind: "balance" };
  }

  if (REPORT_WORDS.some((w) => lower.startsWith(w))) {
    let period: "day" | "week" | "month" = "month";
    if (lower.includes("hoje") || lower.includes("dia") || lower.includes("today") || lower.includes("aujourd") || lower.includes("اليوم") || lower.includes("今天")) {
      period = "day";
    } else if (lower.includes("semana") || lower.includes("week") || lower.includes("semaine") || lower.includes("أسبوع") || lower.includes("本周")) {
      period = "week";
    }
    return { kind: "report", period };
  }

  if (CONTACTS_LIST_WORDS.some((w) => lower === w.toLowerCase())) {
    return { kind: "list_contacts" };
  }

  // Adicionar contato/lead: "contato Joao 11999998888 empresa Acme"
  const prefixPattern = ADD_CONTACT_PREFIXES.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const contactMatch = lower.match(new RegExp(`^(${prefixPattern})\\s+(.+)`, "u"));
  if (contactMatch) {
    const rest = text.slice(text.toLowerCase().indexOf(contactMatch[2])).trim();
    const phone = extractPhone(rest);
    let working = rest;
    if (phone) {
      working = working.replace(/(\+?\d[\d\s().-]{8,}\d)/, " ").trim();
    }
    let company: string | undefined;
    const companyMatch = working.match(/\b(empresa|company|entreprise|شركة|公司)\s+(.+)/iu);
    if (companyMatch) {
      company = companyMatch[2].trim();
      working = working.slice(0, working.toLowerCase().indexOf(companyMatch[1].toLowerCase())).trim();
    }
    const name = working.replace(/\s+/g, " ").trim();
    if (name) {
      return { kind: "add_contact", name, phone, company };
    }
  }

  // Transação por sinal explícito: "+1000 ..." (receita) ou "-50 ..." (despesa)
  const signed = text.match(/^([+-])\s*(.+)/);
  if (signed) {
    const amount = extractAmount(signed[2]);
    if (amount) {
      const type: TransactionType = signed[1] === "+" ? "INCOME" : "EXPENSE";
      return {
        kind: "transaction",
        type,
        amount,
        description: cleanDescription(signed[2], amount),
      };
    }
  }

  // Transação por palavra-chave + valor
  const amount = extractAmount(text);
  if (amount) {
    const isIncome = INCOME_WORDS.some((w) => lower.includes(w));
    const isExpense = EXPENSE_WORDS.some((w) => lower.includes(w));
    // Default: despesa (uso mais comum no controle de gastos).
    const type: TransactionType = isIncome && !isExpense ? "INCOME" : "EXPENSE";
    return {
      kind: "transaction",
      type,
      amount,
      description: cleanDescription(text, amount),
    };
  }

  return { kind: "unknown", text };
}
