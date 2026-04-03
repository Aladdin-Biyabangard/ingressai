import { useParams } from "react-router-dom";
import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "@/lib/i18n/constants";

export function useLocalePrefix(): { lang: Locale; prefix: string } {
  const { lang: raw } = useParams<{ lang: string }>();
  const lang = raw && isSupportedLocale(raw) ? raw : DEFAULT_LOCALE;
  return { lang, prefix: `/${lang}` };
}
