"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGE_COOKIE, type Language } from "@/lib/i18n/config";
import { t as translate, translations } from "@/lib/i18n/translations";

type Namespace = keyof typeof translations.pt;

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: <N extends Namespace>(
    namespace: N,
    key: keyof (typeof translations)["pt"][N],
    vars?: Record<string, string | number>
  ) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Language;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<Language>(initialLang);

  const setLang = useCallback(
    (next: Language) => {
      setLangState(next);
      document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
      fetch("/api/i18n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: next }),
      }).finally(() => router.refresh());
    },
    [router]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (namespace, key, vars) => translate(lang, namespace, key, vars),
    }),
    [lang, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
