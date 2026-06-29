import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import NavLink from "@/components/NavLink";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-slate-200 bg-white md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-5">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-brand-700">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              H
            </span>
            HSantos
          </Link>
          <div className="md:hidden">
            <LogoutButton />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:gap-1 md:pb-0">
          <NavLink href="/dashboard" emoji="📊" label="Visão geral" />
          <NavLink href="/dashboard/expenses" emoji="💸" label="Gastos" />
          <NavLink href="/dashboard/crm" emoji="🤝" label="CRM" />
          <NavLink href="/dashboard/settings" emoji="⚙️" label="Configurações" />
        </nav>
        <div className="hidden border-t border-slate-200 p-5 md:block">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
          <div className="mt-2">
            <LogoutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
