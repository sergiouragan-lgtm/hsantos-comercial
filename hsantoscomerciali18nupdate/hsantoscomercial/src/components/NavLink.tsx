"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  emoji,
  label,
}: {
  href: string;
  emoji: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-brand-50 text-brand-700"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <span className="text-lg">{emoji}</span>
      {label}
    </Link>
  );
}
