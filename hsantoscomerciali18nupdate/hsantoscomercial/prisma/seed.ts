import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_CATEGORIES } from "../src/lib/categories";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@hsantos.com";
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Usuário Demo",
      email,
      passwordHash,
      whatsappNumber: "5511999998888",
      currency: "BRL",
      monthlyBudget: "3000",
    },
  });

  const count = await prisma.category.count({ where: { userId: user.id } });
  if (count === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((c) => ({
        userId: user.id,
        name: c.name,
        type: c.type,
        emoji: c.emoji,
      })),
    });
  }

  const cats = await prisma.category.findMany({ where: { userId: user.id } });
  const byName = (n: string) => cats.find((c) => c.name === n)?.id ?? null;

  const txCount = await prisma.transaction.count({ where: { userId: user.id } });
  if (txCount === 0) {
    await prisma.transaction.createMany({
      data: [
        { userId: user.id, type: "INCOME", amount: "3500", description: "Salário", categoryId: byName("Salário"), source: "WEB" },
        { userId: user.id, type: "EXPENSE", amount: "450.90", description: "Mercado", categoryId: byName("Alimentação"), source: "WHATSAPP" },
        { userId: user.id, type: "EXPENSE", amount: "60", description: "Uber", categoryId: byName("Transporte"), source: "WHATSAPP" },
        { userId: user.id, type: "EXPENSE", amount: "1200", description: "Aluguel", categoryId: byName("Moradia"), source: "WEB" },
        { userId: user.id, type: "EXPENSE", amount: "89.90", description: "Farmácia", categoryId: byName("Saúde"), source: "WHATSAPP" },
        { userId: user.id, type: "EXPENSE", amount: "120", description: "Cinema e jantar", categoryId: byName("Lazer"), source: "WHATSAPP" },
      ],
    });
  }

  const contactCount = await prisma.contact.count({ where: { userId: user.id } });
  if (contactCount === 0) {
    await prisma.contact.createMany({
      data: [
        { userId: user.id, name: "Maria Souza", company: "Acme Ltda", phone: "5511988887777", stage: "NEGOTIATION", value: "5000" },
        { userId: user.id, name: "João Lima", company: "Beta Tech", phone: "5511977776666", stage: "LEAD" },
        { userId: user.id, name: "Ana Pereira", company: "Gamma SA", stage: "CUSTOMER", value: "12000" },
      ],
    });
  }

  console.log("Seed concluído. Login: demo@hsantos.com / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
