import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ClipboardList, Gift, Loader2, Plus, Shield, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReferralProgramAdminListCard } from "@/components/admin/ReferralProgramAdminListCard";
import { ADMIN_REFERRALS_CREATE_PATH } from "@/lib/admin/referralAdminRoutes";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";
import { getApiErrorMessage } from "@/lib/utils/api/httpError";
import { REFERRAL_PROGRAMS_QUERY_KEY, searchReferralPrograms } from "@/lib/utils/api/referralProgram";

const ReferralProgramsAdminListPage = () => {
  const { t } = useTranslation();
  const { prefix } = useLocalePrefix();

  const listQuery = useQuery({
    queryKey: REFERRAL_PROGRAMS_QUERY_KEY,
    queryFn: searchReferralPrograms,
  });

  const copyCode = useCallback(
    (code: string) => {
      void navigator.clipboard.writeText(code).then(
        () => toast.success(t("referralAdmin.copiedToast")),
        () => toast.error(t("referralAdmin.copyFailed")),
      );
    },
    [t],
  );

  const programs = listQuery.data ?? [];

  return (
    <div className="relative min-h-screen-dvh min-w-0 overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="landing-glow-orb absolute -left-[18%] top-[6%] size-[min(88vw,400px)] rounded-full bg-primary/14" />
        <div className="landing-glow-orb absolute -right-[12%] top-[32%] size-[min(80vw,360px)] rounded-full bg-accent/12 [animation-delay:-4s]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_-8%,hsl(var(--primary)_/_0.1),transparent_55%)]" />
      </div>

      <div className="relative z-10 px-safe pb-12 pt-[max(1rem,env(safe-area-inset-top))] sm:pb-16">
        <div className="container max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Link
                to={`${prefix}/dashboard`}
                className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-primary transition hover:text-[hsl(var(--gradient-end))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                {t("referralAdmin.backToDashboard")}
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-primary/35 bg-primary/10 font-semibold text-primary">
                  <Shield className="mr-1 inline size-3.5" aria-hidden />
                  {t("referralAdmin.badgeAdmin")}
                </Badge>
                <Badge variant="outline" className="border-accent/40 text-[hsl(var(--gradient-end))]">
                  <ClipboardList className="mr-1 inline size-3.5" aria-hidden />
                  {t("referralAdmin.badgeList")}
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t("referralAdmin.pageListTitle")}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{t("referralAdmin.pageListSubtitle")}</p>
            </div>
            <Button
              asChild
              className="h-12 min-h-11 shrink-0 gradient-primary border-0 font-semibold text-primary-foreground shadow-md shadow-primary/25 sm:mt-4"
            >
              <Link to={`${prefix}/${ADMIN_REFERRALS_CREATE_PATH}`} aria-label={t("referralAdmin.newProgramAria")}>
                <Plus className="mr-2 size-4" aria-hidden />
                {t("referralAdmin.newProgram")}
              </Link>
            </Button>
          </div>

          <Card className="border-primary/20 shadow-md">
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 border-b border-border/80 pb-4">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Sparkles className="size-5 shrink-0 text-primary" aria-hidden />
                  {t("referralAdmin.sectionList")}
                </CardTitle>
                <CardDescription className="mt-1">{t("referralAdmin.sectionListHint")}</CardDescription>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="shrink-0 border-primary/25"
                disabled={listQuery.isFetching}
                onClick={() => void listQuery.refetch()}
              >
                {listQuery.isFetching ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  t("referralAdmin.refresh")
                )}
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {listQuery.isLoading ? (
                <div className="flex min-h-[14rem] items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
                  <span className="text-sm">{t("common.loading")}</span>
                </div>
              ) : listQuery.isError ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-3 text-sm text-destructive">
                  {getApiErrorMessage(listQuery.error, t("referralAdmin.loadError"))}
                </p>
              ) : programs.length === 0 ? (
                <div className="flex min-h-[14rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/25 bg-primary/[0.03] px-4 py-10 text-center">
                  <Gift className="size-12 text-primary/60" aria-hidden />
                  <p className="text-sm font-medium text-foreground">{t("referralAdmin.emptyTitle")}</p>
                  <p className="max-w-sm text-xs text-muted-foreground">{t("referralAdmin.emptyBody")}</p>
                  <Button asChild className="mt-2 gradient-primary border-0 text-primary-foreground">
                    <Link to={`${prefix}/${ADMIN_REFERRALS_CREATE_PATH}`}>{t("referralAdmin.newProgram")}</Link>
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[min(36rem,calc(100dvh-12rem))] pr-3">
                  <ul className="space-y-4 pb-2">
                    {programs.map((p) => (
                      <li key={p.program}>
                        <ReferralProgramAdminListCard program={p} onCopyCode={copyCode} />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgramsAdminListPage;
