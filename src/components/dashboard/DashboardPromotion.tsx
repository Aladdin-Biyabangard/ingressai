import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Bot, Copy, Gift, Loader2, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";
import {
  formatProgressLabel,
  mapReferralProgramToDashboardCard,
  parseReferralSteps,
  referralProgressPercent,
  type ReferralProgramBadge,
  type ReferralProgramI18n,
} from "@/lib/referralPrograms";
import { cn } from "@/lib/utils";
import { buildReferralInviteUrl } from "@/lib/referralInviteUrl";
import { REFERRAL_PROGRAMS_QUERY_KEY, searchReferralPrograms } from "@/lib/utils/api/referralProgram";

const STEP_ICONS = [Share2, Users, Gift] as const;

const ACCENT_STYLES = {
  amber: {
    card: "border-primary/30 bg-gradient-to-br from-primary/[0.07] via-card to-accent/[0.08] shadow-md shadow-primary/15",
    orb: "bg-primary/22",
    progress: "[&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-[hsl(var(--gradient-end))]",
  },
  violet: {
    card: "border-[hsl(var(--gradient-end))]/35 bg-gradient-to-br from-[hsl(var(--gradient-end))]/[0.11] via-card to-primary/[0.06] shadow-md shadow-primary/12",
    orb: "bg-[hsl(var(--gradient-end))]/25",
    progress: "[&>div]:bg-gradient-to-r [&>div]:from-[hsl(var(--gradient-end))] [&>div]:to-primary",
  },
  sky: {
    card: "border-primary/25 bg-gradient-to-br from-accent/[0.14] via-card to-primary/[0.05] shadow-md shadow-accent/18",
    orb: "bg-accent/22",
    progress: "[&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary",
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
      <Badge variant="secondary" className="border border-success/35 bg-success/12 font-medium text-success">
        {badge.label}
      </Badge>
    );
  }
  if (badge.tone === "active") {
    return (
      <Badge variant="secondary" className="border border-primary/35 bg-primary/10 font-medium text-primary">
        {badge.label}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-dashed border-muted-foreground/35 text-muted-foreground">
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
    const url = buildReferralInviteUrl(lang, program.code, program.id);
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
          <Badge className="border-primary/35 bg-primary/10 font-medium text-primary hover:bg-primary/15">{program.eyebrow}</Badge>
          <span className="text-xs font-medium text-[hsl(var(--gradient-end))]">{program.highlight}</span>
        </div>
        <h2 id={`referral-title-${program.id}`} className="mt-3 text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {program.title}
        </h2>
        <p className="mt-2 text-sm leading-snug text-muted-foreground">{program.subtitle}</p>

        <div className="mt-5 rounded-xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{progressText}</p>
              <Progress value={pct} className={cn("mt-2 h-2.5 bg-muted", accent.progress)} />
              <p className="mt-1.5 text-xs text-muted-foreground">{program.progressHint}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 lg:max-w-[min(100%,18rem)] lg:justify-end">
              {program.badges.map((b, i) => (
                <ReferralBadgePill key={`${program.id}-badge-${i}`} badge={b} />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">{t("landing.codeLabel")}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <code className="max-w-full truncate rounded-lg border border-primary/25 bg-primary/5 px-2.5 py-1.5 font-mono text-xs tracking-wide text-foreground sm:text-sm">
                  {program.code}
                </code>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-10 shrink-0 border-2 border-primary/40 bg-primary/10 font-semibold text-foreground shadow-sm shadow-primary/15 hover:border-primary hover:bg-primary/15"
                  onClick={copyCode}
                >
                  <Copy className="size-4" aria-hidden />
                  {t("landing.copyCode")}
                </Button>
              </div>
            </div>
            <Button
              type="button"
              className="gradient-primary h-12 min-h-11 shrink-0 rounded-xl border-0 font-bold text-primary-foreground shadow-lg shadow-primary/35 ring-2 ring-primary/30 transition hover:opacity-[0.96] hover:shadow-primary/45 hover:ring-primary/40 sm:min-w-[11rem]"
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
        "fixed fixed-fab-bl z-50 flex h-12 max-w-[min(14rem,calc(100vw-5rem-env(safe-area-inset-left)-env(safe-area-inset-right)))] items-center gap-2 rounded-full border-2 border-primary/45 bg-gradient-to-r from-primary/[0.08] via-card to-accent/[0.1] px-3 shadow-xl shadow-primary/25 ring-2 ring-primary/25 backdrop-blur-md transition-[transform,box-shadow] hover:scale-[1.02] hover:border-primary hover:shadow-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:scale-100 sm:h-12 sm:gap-2.5 sm:px-4",
        className,
      )}
      aria-label={t("landing.referralFabAria")}
    >
      <span className="gradient-primary flex size-10 shrink-0 items-center justify-center rounded-full text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary-foreground/25">
        <Gift className="size-5" aria-hidden />
      </span>
      <span className="hidden min-w-0 flex-col items-start text-left sm:flex">
        <span className="truncate text-xs font-semibold text-foreground">{t("landing.referralFabShort")}</span>
        <span className="truncate text-[10px] text-muted-foreground">{t("landing.referralFabHint")}</span>
      </span>
    </button>
  );
}

export function DashboardPromotion() {
  const { t, i18n } = useTranslation();
  const { prefix } = useLocalePrefix();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();

  const programsQuery = useQuery({
    queryKey: REFERRAL_PROGRAMS_QUERY_KEY,
    queryFn: searchReferralPrograms,
  });

  const programs = useMemo(() => {
    const rows = programsQuery.data;
    if (!rows?.length) return [];
    return rows.map((dto, i) =>
      mapReferralProgramToDashboardCard(dto, {
        progressLabelTemplate: t("landing.referralProgressLabelDefault"),
        eyebrowDefault: t("landing.referralProgramEyebrowDefault"),
        accentIndex: i,
      }),
    );
  }, [programsQuery.data, t, i18n.language]);

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
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between sm:pb-6">
          <div className="min-w-0">
            <Badge className="border-primary/35 bg-primary/10 font-semibold text-primary">{t("landing.referralPageBadge")}</Badge>
            <h1
              id="referral-page-title"
              className="mt-2 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl"
            >
              {t("landing.referralLeadTitle")}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground sm:text-[0.9375rem]">{t("landing.referralLeadSubtitle")}</p>
          </div>
          <Button
            type="button"
            onClick={goToChat}
            className="gradient-primary h-12 min-h-11 w-full shrink-0 rounded-xl border-0 font-bold text-primary-foreground shadow-lg shadow-primary/35 ring-2 ring-primary/30 transition hover:opacity-[0.96] hover:shadow-primary/45 hover:ring-primary/40 sm:mt-7 sm:w-auto sm:min-w-[11rem]"
          >
            <Bot className="size-4 text-primary-foreground drop-shadow-sm" aria-hidden />
            {t("landing.ctaChat")}
          </Button>
        </div>

        {referralSteps.length > 0 ? (
          <div
            className="mt-5 rounded-xl border border-primary/25 bg-gradient-to-b from-primary/[0.06] to-card px-3 py-4 sm:mt-6 sm:px-4 sm:py-4"
            aria-label={t("landing.referralHowItWorksTitle")}
          >
            <p className="text-center text-[11px] font-bold uppercase tracking-wider text-primary sm:text-left">
              {t("landing.referralHowItWorksTitle")}
            </p>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {referralSteps.map((step, i) => {
                const Icon = STEP_ICONS[i % STEP_ICONS.length];
                return (
                  <li
                    key={`referral-step-${i}`}
                    className="flex min-w-0 gap-3 rounded-lg border border-border bg-card p-3 shadow-sm sm:block sm:p-3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary sm:mb-2 sm:size-8">
                      <Icon className="size-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[hsl(var(--gradient-end))]">{t("landing.stepLabel", { step: i + 1 })}</p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-foreground">{step.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}

        <div className="mt-6 sm:mt-7">
          {programsQuery.isLoading ? (
            <div className="flex min-h-[10rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/20 bg-primary/[0.03] py-10">
              <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
              <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
            </div>
          ) : programsQuery.isError ? (
            <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-6 text-center">
              <p className="text-sm text-destructive">{t("landing.referralProgramsLoadError")}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 border-destructive/30"
                onClick={() => void programsQuery.refetch()}
              >
                {t("landing.referralProgramsRetry")}
              </Button>
            </div>
          ) : programs.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">{t("landing.referralProgramsEmpty")}</p>
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
