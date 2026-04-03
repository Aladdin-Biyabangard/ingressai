import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import i18n from "@/lib/i18n/instance";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/lib/i18n/constants";

/**
 * Syncs URL `/:lang` with i18n and `document.documentElement.lang`.
 * If the first segment is not a supported locale, normalizes to `/{default}/{rest}`.
 */
export function LocaleLayout() {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lang) return;

    if (isSupportedLocale(lang)) {
      void i18n.changeLanguage(lang);
      document.documentElement.lang = lang;
      return;
    }

    const segments = location.pathname.split("/").filter(Boolean);
    let target: string;
    if (segments.length >= 2) {
      target = `/${DEFAULT_LOCALE}/${segments.slice(1).join("/")}`;
    } else if (segments.length === 1) {
      target = `/${DEFAULT_LOCALE}/${segments[0]}`;
    } else {
      target = `/${DEFAULT_LOCALE}`;
    }
    navigate(`${target}${location.search}${location.hash}`, { replace: true });
  }, [lang, location.pathname, location.search, location.hash, navigate]);

  if (!lang || !isSupportedLocale(lang)) {
    return null;
  }

  return <Outlet />;
}
