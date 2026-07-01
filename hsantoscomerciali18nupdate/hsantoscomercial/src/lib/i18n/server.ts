import { cookies, headers } from "next/headers";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  detectLanguageFromAcceptLanguage,
  isSupportedLanguage,
  type Language,
} from "./config";

/** Resolve o idioma atual: cookie do usuário > cabeçalho Accept-Language > padrão. */
export function getLanguage(): Language {
  const cookieValue = cookies().get(LANGUAGE_COOKIE)?.value;
  if (isSupportedLanguage(cookieValue)) return cookieValue;
  const acceptLanguage = headers().get("accept-language");
  return detectLanguageFromAcceptLanguage(acceptLanguage);
}

export { DEFAULT_LANGUAGE };
