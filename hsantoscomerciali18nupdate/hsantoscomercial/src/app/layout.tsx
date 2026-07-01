import type { Metadata } from "next";
import "./globals.css";
import { getLanguage } from "@/lib/i18n/server";
import { isRTL } from "@/lib/i18n/config";
import { LanguageProvider } from "@/components/LanguageProvider";

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
  const lang = getLanguage();
  return (
    <html lang={lang} dir={isRTL(lang) ? "rtl" : "ltr"}>
      <body>
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
