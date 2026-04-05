import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Bot, Copy, Gift, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";
import {
  formatProgressLabel,
  parseReferralPrograms,
  parseReferralSteps,
  referralProgressPercent,
  type ReferralProgramBadge,
  type ReferralProgramI18n,
} from "@/lib/referralPrograms";
import { cn } from "@/lib/utils";

const STEP_ICONS = [Share2, Users, Gift] as const;

const ACCENT_STYLES = {
  amber: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-md shadow-amber-200/50",
    orb: "bg-amber-400/22",
    progress: "[&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-orange-500",
  },
  violet: {
    card: "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 shadow-md shadow-violet-200/50",
    orb: "bg-violet-400/20",
    progress: "[&>div]:bg-gradient-to-r [&>div]:from-violet-400 [&>div]:to-fuchsia-500",
  },
  sky: {
    card: "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50 shadow-md shadow-sky-200/50",
    orb: "bg-sky-400/20",
    progress: "[&>div]:bg-gradient-to-r [&>div]:from-sky-400 [&>div]:to-cyan-500",
  },
} as const;

type AccentKey = keyof typeof ACCENT_STYLES;

function accentFor(raw: string | undefined): (typeof ACCENT_STYLES)[AccentKey] {
  if (raw && raw in ACCENT_STYLES) return ACCENT_STYLES[raw as AccentKey];
  return ACCENT_STYLES.amber;
}

function ReferralBadgePill({ badge }: { badge: ReferralProgramBadge }) {
  if (badge.tone === "earned") {
    return (
      <Badge variant="secondary" className="border border-emerald-300 bg-emerald-100 font-medium text-emerald-900">
        {badge.label}
      </Badge>
    );
  }
  if (badge.tone === "active") {
    return (
      <Badge variant="secondary" className="border border-sky-300 bg-sky-100 font-medium text-sky-900">
        {badge.label}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-dashed border-stone-300 text-stone-500">
      {badge.label}
    </Badge>
  );
}

function ReferralProgramCard({
  program,
  lang,
  t,
}: {
  program: ReferralProgramI18n;
  lang: string | undefined;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  const accent = accentFor(program.accent);
  const pct = referralProgressPercent(program.progressCurrent, program.progressGoal);
  const progressText = formatProgressLabel(program.progressLabel, program.progressCurrent, program.progressGoal);

  const copyCode = useCallback(() => {
    void navigator.clipboard.writeText(program.code).then(
      () => toast.success(t("landing.copySuccess")),
      () => toast.error(t("landing.copyFailed")),
    );
  }, [program.code, t]);

  const copyInviteLink = useCallback(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const base =
      lang && lang.length > 0
        ? `${origin}/${lang}/dashboard?ref=${encodeURIComponent(program.code)}`
        : `${origin}/dashboard?ref=${encodeURIComponent(program.code)}`;
    const url = `${base}&program=${encodeURIComponent(program.id)}`;
    void navigator.clipboard.writeText(url).then(
      () => toast.success(t("landing.copyInviteSuccess")),
      () => toast.error(t("landing.copyFailed")),
    );
  }, [lang, program.code, program.id, t]);

  return (
    <article
      className={cn("relative overflow-hidden rounded-2xl border p-5 sm:p-6", accent.card)}
      aria-labelledby={`referral-title-${program.id}`}
    >
      <div className={cn("pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl sm:size-56", accent.orb)} aria-hidden />
      <div className="relative min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-amber-300 bg-amber-100 font-medium text-amber-900 hover:bg-amber-200/80">{program.eyebrow}</Badge>
          <span className="text-xs font-medium text-amber-800">{program.highlight}</span>
        </div>
        <h2 id={`referral-title-${program.id}`} className="mt-3 text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
          {program.title}
        </h2>
        <p className="mt-2 text-sm leading-snug text-stone-600">{program.subtitle}</p>

        <div className="mt-5 rounded-xl border border-stone-200 bg-white/80 p-4 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-stone-800">{progressText}</p>
              <Progress value={pct} className={cn("mt-2 h-2.5 bg-stone-200", accent.progress)} />
              <p className="mt-1.5 text-xs text-stone-500">{program.progressHint}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 lg:max-w-[min(100%,18rem)] lg:justify-end">
              {program.badges.map((b, i) => (
                <ReferralBadgePill key={`${program.id}-badge-${i}`} badge={b} />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-stone-600">{t("landing.codeLabel")}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <code className="max-w-full truncate rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 font-mono text-xs tracking-wide text-amber-950 sm:text-sm">
                  {program.code}
                </code>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-10 shrink-0 border-2 border-amber-500 bg-amber-100 font-semibold text-amber-950 shadow-sm shadow-amber-500/20 hover:border-amber-600 hover:bg-amber-200"
                  onClick={copyCode}
                >
                  <Copy className="size-4" aria-hidden />
                  {t("landing.copyCode")}
                </Button>
              </div>
            </div>
            <Button
              type="button"
              className="h-12 min-h-11 shrink-0 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 font-bold text-stone-950 shadow-lg shadow-orange-500/40 ring-2 ring-orange-400/45 transition hover:from-amber-300 hover:via-orange-400 hover:to-orange-500 hover:shadow-orange-500/55 hover:ring-orange-300/60 sm:min-w-[11rem]"
              onClick={copyInviteLink}
            >
              <Share2 className="size-4" aria-hidden />
              {t("landing.referralCta")}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function DashboardReferralFab({ className }: { className?: string }) {
  const { t } = useTranslation();

  const scrollToReferral = useCallback(() => {
    document.getElementById("referral")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToReferral}
      className={cn(
        "fixed fixed-fab-bl z-50 flex h-12 max-w-[min(14rem,calc(100vw-5rem-env(safe-area-inset-left)-env(safe-area-inset-right)))] items-center gap-2 rounded-full border-2 border-amber-400 bg-gradient-to-r from-amber-50 via-white to-orange-50 px-3 shadow-xl shadow-amber-500/30 ring-2 ring-orange-300/50 backdrop-blur-md transition-[transform,box-shadow] hover:scale-[1.02] hover:border-amber-500 hover:shadow-amber-500/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none motion-reduce:hover:scale-100 sm:h-12 sm:gap-2.5 sm:px-4",
        className,
      )}
      aria-label={t("landing.referralFabAria")}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 shadow-md shadow-orange-600/35 ring-2 ring-white/80">
        <Gift className="size-5" aria-hidden />
      </span>
      <span className="hidden min-w-0 flex-col items-start text-left sm:flex">
        <span className="truncate text-xs font-semibold text-stone-900">{t("landing.referralFabShort")}</span>
        <span className="truncate text-[10px] text-stone-600">{t("landing.referralFabHint")}</span>
      </span>
    </button>
  );
}

export function DashboardPromotion() {
  const { t, i18n } = useTranslation();
  const { prefix } = useLocalePrefix();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();

  const programs = useMemo(() => {
    const raw = t("landing.referralPrograms", { returnObjects: true });
    return parseReferralPrograms(raw);
  }, [i18n.language, t]);

  const referralSteps = useMemo(() => {
    const raw = t("landing.referralSteps", { returnObjects: true });
    return parseReferralSteps(raw);
  }, [i18n.language, t]);

  const goToChat = useCallback(() => {
    navigate(`${prefix}/chat`);
  }, [navigate, prefix]);

  return (
    <section id="referral" className="scroll-mt-4 px-safe pb-12 pt-4 sm:pb-14 sm:pt-5" aria-labelledby="referral-page-title">
      <div className="container max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between sm:pb-6">
          <div className="min-w-0">
            <Badge className="border-amber-300 bg-amber-100 font-semibold text-amber-900">{t("landing.referralPageBadge")}</Badge>
            <h1
              id="referral-page-title"
              className="mt-2 text-2xl font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl"
            >
              {t("landing.referralLeadTitle")}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-stone-600 sm:text-[0.9375rem]">{t("landing.referralLeadSubtitle")}</p>
          </div>
          <Button
            type="button"
            onClick={goToChat}
            className="h-12 min-h-11 w-full shrink-0 rounded-xl border-0 bg-gradient-to-r from-sky-500 to-cyan-500 font-bold text-white shadow-lg shadow-sky-500/40 ring-2 ring-sky-300/60 transition hover:from-sky-400 hover:to-cyan-400 hover:shadow-sky-500/55 hover:ring-sky-200/70 sm:mt-7 sm:w-auto sm:min-w-[11rem]"
          >
            <Bot className="size-4 text-white drop-shadow-sm" aria-hidden />
            {t("landing.ctaChat")}
          </Button>
        </div>

        {referralSteps.length > 0 ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50/90 to-white px-3 py-4 sm:mt-6 sm:px-4 sm:py-4" aria-label={t("landing.referralHowItWorksTitle")}>
            <p className="text-center text-[11px] font-bold uppercase tracking-wider text-amber-800 sm:text-left">
              {t("landing.referralHowItWorksTitle")}
            </p>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {referralSteps.map((step, i) => {
                const Icon = STEP_ICONS[i % STEP_ICONS.length];
                return (
                  <li
                    key={`referral-step-${i}`}
                    className="flex min-w-0 gap-3 rounded-lg border border-stone-200 bg-white p-3 shadow-sm sm:block sm:p-3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-700 sm:mb-2 sm:size-8">
                      <Icon className="size-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-amber-700">{t("landing.stepLabel", { step: i + 1 })}</p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-stone-900">{step.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-stone-600">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}

        <div className="mt-6 sm:mt-7">
          {programs.length === 0 ? (
            <p className="text-center text-sm text-stone-500">{t("landing.referralProgramsEmpty")}</p>
          ) : (
            <div
              className={cn(
                "grid gap-4 sm:gap-5",
                programs.length === 1 && "mx-auto max-w-2xl",
                programs.length >= 2 && "md:grid-cols-2",
                programs.length >= 3 && "xl:grid-cols-3",
              )}
            >
              {programs.map((program) => (
                <ReferralProgramCard key={program.id} program={program} lang={lang} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
