import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HSantos — Gastos & CRM no WhatsApp",
  description:
    "Controle suas finanças pessoais e gerencie seu CRM diretamente pelo WhatsApp Business.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
