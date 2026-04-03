export const SUPPORTED_LOCALES = ["az", "en", "ru"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(value: string | undefined): value is Locale {
  return value !== undefined && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

const envLang = import.meta.env.VITE_DEFAULT_LANG;
export const DEFAULT_LOCALE: Locale =
  envLang && isSupportedLocale(envLang) ? envLang : "en";

/** Prefer stored UI language when opening `/`. */
export function getStoredOrDefaultLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const raw = window.localStorage.getItem("i18nextLng");
  if (raw && isSupportedLocale(raw)) return raw;
  return DEFAULT_LOCALE;
}
