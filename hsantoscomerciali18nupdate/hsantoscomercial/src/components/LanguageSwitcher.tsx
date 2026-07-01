"use client";

import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from "@/lib/i18n/config";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <select
      aria-label="Language"
      className={`rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm ${className}`}
      value={lang}
      onChange={(e) => setLang(e.target.value as typeof lang)}
    >
      {SUPPORTED_LANGUAGES.map((code) => (
        <option key={code} value={code}>
          {LANGUAGE_LABELS[code]}
        </option>
      ))}
    </select>
  );
}
