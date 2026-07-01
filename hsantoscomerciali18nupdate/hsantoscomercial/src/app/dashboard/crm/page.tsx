import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CrmClient from "@/components/CrmClient";
import { t } from "@/lib/i18n/translations";
import type { Language } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const user = (await getCurrentUser())!;
  const lang = user.language as Language;

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
      <h1 className="text-2xl font-bold">{t(lang, "crm", "title")}</h1>
      <p className="mb-6 text-sm text-slate-500">{t(lang, "crm", "subtitle")}</p>
      <CrmClient
        lang={lang}
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
