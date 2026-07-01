"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ label = "Sair" }: { label?: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-800">
      {label}
    </button>
  );
}
