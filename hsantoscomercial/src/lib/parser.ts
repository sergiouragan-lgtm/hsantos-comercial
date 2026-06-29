// Parser leve de linguagem natural (pt-BR) para comandos do WhatsApp.
// Não usa LLM — heurísticas/regex suficientes para os fluxos do MVP.

import { TransactionType } from "@prisma/client";

export type ParsedIntent =
  | { kind: "help" }
  | { kind: "greeting" }
  | { kind: "balance" }
  | { kind: "report"; period: "day" | "week" | "month" }
  | { kind: "list_contacts" }
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

const HELP_WORDS = ["ajuda", "help", "menu", "comandos", "?"];
const GREETING_WORDS = ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "eai", "e ai"];
const BALANCE_WORDS = ["saldo", "quanto tenho", "balanço", "balanco"];

// Palavras que indicam receita (entrada de dinheiro).
const INCOME_WORDS = ["recebi", "receita", "ganhei", "entrou", "salario", "salário", "vendi", "venda"];
// Palavras que indicam despesa.
const EXPENSE_WORDS = ["gastei", "paguei", "comprei", "gasto", "despesa", "saiu"];

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

function cleanDescription(text: string, amount: number): string {
  let desc = text
    // remove números/moeda relativos ao valor
    .replace(/r\$\s*/gi, "")
    .replace(/\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?/g, " ")
    .replace(/\breais?\b/gi, " ")
    .replace(/\bno\b|\bna\b|\bnos\b|\bnas\b|\bde\b|\bdo\b|\bda\b|\bcom\b|\bem\b/gi, " ")
    .replace(/\b(gastei|paguei|comprei|gasto|despesa|recebi|receita|ganhei|entrou|vendi|venda)\b/gi, " ")
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

  if (lower.startsWith("relatorio") || lower.startsWith("relatório") || lower.startsWith("resumo") || lower.startsWith("extrato")) {
    let period: "day" | "week" | "month" = "month";
    if (lower.includes("hoje") || lower.includes("dia")) period = "day";
    else if (lower.includes("semana")) period = "week";
    return { kind: "report", period };
  }

  if (
    lower === "contatos" ||
    lower === "leads" ||
    lower === "crm" ||
    lower === "clientes"
  ) {
    return { kind: "list_contacts" };
  }

  // Adicionar contato/lead: "contato Joao 11999998888 empresa Acme"
  const contactMatch = lower.match(/^(contato|lead|cliente|novo lead|novo contato)\s+(.+)/);
  if (contactMatch) {
    const rest = text.slice(text.toLowerCase().indexOf(contactMatch[2])).trim();
    const phone = extractPhone(rest);
    let working = rest;
    if (phone) {
      working = working.replace(/(\+?\d[\d\s().-]{8,}\d)/, " ").trim();
    }
    let company: string | undefined;
    const companyMatch = working.match(/\b(empresa|company)\s+(.+)/i);
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
