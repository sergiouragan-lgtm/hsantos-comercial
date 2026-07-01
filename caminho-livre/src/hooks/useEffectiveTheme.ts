"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { THEMES } from "@/lib/constants";
import type { ThemeMode } from "@/types";

export function useEffectiveTheme(themeMode: ThemeMode) {
  const [hour, setHour] = useState(12);

  useEffect(() => {
    setHour(new Date().getHours());
    const id = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(id);
  }, []);

  const autoIsLight = hour >= 6 && hour < 19;
  const effectiveName = themeMode === "auto" ? (autoIsLight ? "light" : "dark") : themeMode;
  const theme = THEMES[effectiveName] || THEMES.dark;
  const isDarkEffective = effectiveName !== "light";

  const themeVars: CSSProperties = {
    ["--bg" as string]: theme.bg,
    ["--outer-bg" as string]: theme.outerBg,
    ["--card" as string]: theme.card,
    ["--nav-bg" as string]: theme.navBg,
    ["--text" as string]: theme.text,
    ["--text-muted" as string]: theme.textMuted,
    ["--border-rgb" as string]: theme.borderRgb,
    ["--accent" as string]: theme.accent,
    ["--accent-rgb" as string]: theme.accentRgb,
    ["--accent2" as string]: theme.accent2,
    ["--gold" as string]: theme.gold,
    ["--gold-rgb" as string]: theme.goldRgb,
    ["--orange" as string]: theme.orange,
    ["--orange-rgb" as string]: theme.orangeRgb,
    ["--blue" as string]: theme.blue,
    ["--blue-rgb" as string]: theme.blueRgb,
    ["--purple" as string]: theme.purple,
  };

  return { themeVars, isDarkEffective };
}
