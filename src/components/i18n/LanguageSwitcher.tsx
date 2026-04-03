import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { SUPPORTED_LOCALES, isSupportedLocale, type Locale } from "@/lib/i18n/constants";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Compact row of buttons (default) or short labels only on wide screens */
  variant?: "default" | "minimal";
};

function currentLocaleCode(i18n: { language: string; resolvedLanguage?: string }): string {
  const raw = i18n.resolvedLanguage ?? i18n.language;
  return raw.split("-")[0] ?? raw;
}

export function LanguageSwitcher({ className, variant = "default" }: Props) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const active = currentLocaleCode(i18n);

  const switchTo = (next: Locale) => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      navigate(`/${next}${location.search}${location.hash}`);
      return;
    }
    if (isSupportedLocale(segments[0])) {
      segments[0] = next;
      navigate(`/${segments.join("/")}${location.search}${location.hash}`);
    } else {
      navigate(`/${next}${location.pathname}${location.search}${location.hash}`);
    }
  };

  const label: Record<Locale, string> = {
    az: "AZ",
    en: "EN",
    ru: "RU",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1",
        variant === "minimal" && "border-0 bg-transparent p-0 gap-0.5",
        className,
      )}
      role="group"
      aria-label={t("common.language")}
    >
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          className={cn(
            "min-h-9 min-w-9 rounded-md px-2 text-xs font-semibold transition-colors sm:min-w-[2.75rem]",
            active === code
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label[code]}
        </button>
      ))}
    </div>
  );
}
