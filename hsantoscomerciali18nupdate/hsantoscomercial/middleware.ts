import { NextRequest, NextResponse } from "next/server";
import {
  LANGUAGE_COOKIE,
  detectLanguageFromAcceptLanguage,
  isSupportedLanguage,
} from "@/lib/i18n/config";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const current = req.cookies.get(LANGUAGE_COOKIE)?.value;

  if (!isSupportedLanguage(current)) {
    // Detecta o idioma pelo cabeçalho enviado automaticamente pelo telefone/
    // navegador (reflete o idioma configurado no aparelho / rede), sem exigir
    // permissão de localização (GPS).
    const detected = detectLanguageFromAcceptLanguage(
      req.headers.get("accept-language")
    );
    res.cookies.set(LANGUAGE_COOKIE, detected, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
