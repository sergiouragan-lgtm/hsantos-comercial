export const SUPPORTED_LANGUAGES = ["pt", "en", "fr", "ar", "zh"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "pt";

export const LANGUAGE_COOKIE = "hsantos_lang";

export const LANGUAGE_LABELS: Record<Language, string> = {
  pt: "Português",
  en: "English",
  fr: "Français",
  ar: "العربية",
  zh: "中文",
};

export function isSupportedLanguage(value: string | undefined | null): value is Language {
  return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function isRTL(lang: Language): boolean {
  return lang === "ar";
}

/**
 * Detecta o idioma a partir do cabeçalho HTTP `Accept-Language`, que o
 * telefone/navegador envia automaticamente com base no idioma configurado
 * no aparelho (normalmente alinhado à rede/operadora/região do usuário).
 * Não usa GPS: localização não determina idioma e exigiria permissão extra.
 */
export function detectLanguageFromAcceptLanguage(
  header: string | null | undefined
): Language {
  if (!header) return DEFAULT_LANGUAGE;

  const parsed = header
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";q=");
      const q = qPart ? parseFloat(qPart) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of parsed) {
    const primary = tag.split("-")[0];
    if (isSupportedLanguage(primary)) return primary;
  }
  return DEFAULT_LANGUAGE;
}
