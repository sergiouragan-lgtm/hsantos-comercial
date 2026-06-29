import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CrmClient from "@/components/CrmClient";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const user = (await getCurrentUser())!;

  const contacts = await prisma.contact.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      interactions: {
        where: { done: false, dueAt: { not: null } },
        orderBy: { dueAt: "asc" },
        take: 1,
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">CRM</h1>
      <p className="mb-6 text-sm text-slate-500">
        Gerencie seus leads e clientes pelo funil de vendas.
      </p>
      <CrmClient
        currency={user.currency}
        initialContacts={contacts.map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email,
          company: c.company,
          stage: c.stage,
          value: c.value ? c.value.toString() : null,
          notes: c.notes,
          nextFollowUp: c.interactions[0]?.dueAt?.toISOString() ?? null,
          updatedAt: c.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
