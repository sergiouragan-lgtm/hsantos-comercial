import { prisma } from "./prisma";
import { TransactionType } from "@prisma/client";

/** Categorias padrão criadas para cada novo usuário. */
export const DEFAULT_CATEGORIES: {
  name: string;
  type: TransactionType;
  emoji: string;
  keywords: string[];
}[] = [
  { name: "Alimentação", type: "EXPENSE", emoji: "🍽️", keywords: ["mercado", "comida", "almoço", "almoco", "jantar", "lanche", "restaurante", "ifood", "padaria", "supermercado", "feira"] },
  { name: "Transporte", type: "EXPENSE", emoji: "🚗", keywords: ["uber", "99", "gasolina", "combustivel", "combustível", "onibus", "ônibus", "metro", "metrô", "passagem", "estacionamento", "pedagio", "pedágio"] },
  { name: "Moradia", type: "EXPENSE", emoji: "🏠", keywords: ["aluguel", "condominio", "condomínio", "luz", "agua", "água", "gas", "gás", "internet", "iptu"] },
  { name: "Saúde", type: "EXPENSE", emoji: "💊", keywords: ["farmacia", "farmácia", "remedio", "remédio", "medico", "médico", "consulta", "dentista", "plano", "academia"] },
  { name: "Lazer", type: "EXPENSE", emoji: "🎉", keywords: ["cinema", "bar", "balada", "viagem", "show", "netflix", "spotify", "streaming", "jogo"] },
  { name: "Educação", type: "EXPENSE", emoji: "📚", keywords: ["curso", "livro", "faculdade", "escola", "mensalidade"] },
  { name: "Compras", type: "EXPENSE", emoji: "🛍️", keywords: ["roupa", "shopping", "loja", "amazon", "mercadolivre", "presente"] },
  { name: "Outros", type: "EXPENSE", emoji: "💸", keywords: [] },
  { name: "Salário", type: "INCOME", emoji: "💰", keywords: ["salario", "salário", "pagamento", "pix recebido"] },
  { name: "Vendas", type: "INCOME", emoji: "🤝", keywords: ["venda", "vendi", "cliente pagou"] },
  { name: "Outras Receitas", type: "INCOME", emoji: "📈", keywords: ["rendimento", "extra", "freela", "freelance"] },
];

export async function ensureDefaultCategories(userId: string): Promise<void> {
  const existing = await prisma.category.count({ where: { userId } });
  if (existing > 0) return;
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({
      userId,
      name: c.name,
      type: c.type,
      emoji: c.emoji,
    })),
  });
}

/**
 * Tenta inferir a categoria a partir do texto livre, usando as palavras-chave.
 * Retorna o nome canônico da categoria ou "Outros"/"Outras Receitas".
 */
export function guessCategoryName(
  text: string,
  type: TransactionType
): string {
  const lower = text.toLowerCase();
  for (const cat of DEFAULT_CATEGORIES) {
    if (cat.type !== type) continue;
    if (cat.keywords.some((k) => lower.includes(k))) {
      return cat.name;
    }
  }
  return type === "EXPENSE" ? "Outros" : "Outras Receitas";
}
