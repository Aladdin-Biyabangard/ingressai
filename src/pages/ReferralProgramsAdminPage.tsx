import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ClipboardList,
  Hash,
  Loader2,
  Plus,
  Shield,
  Sparkles,
  Tags,
  Target,
  TextQuote,
  Trash2,
  Type,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_REFERRALS_LIST_PATH } from "@/lib/admin/referralAdminRoutes";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";
import { getApiErrorMessage } from "@/lib/utils/api/httpError";
import { createReferralProgram } from "@/lib/utils/api/referralProgram";

type FormValues = {
  program: string;
  highlight: string;
  title: string;
  subtitle: string;
  progressGoal: number;
  progressHint: string;
  badges: { value: string }[];
};

const ReferralProgramsAdminPage = () => {
  const { t, i18n } = useTranslation();
  const { prefix } = useLocalePrefix();

  const schema = useMemo(
    () =>
      z.object({
        program: z.string().trim().min(1, t("referralAdmin.validation.programRequired")),
        highlight: z.string().trim().min(1, t("referralAdmin.validation.highlightRequired")),
        title: z.string().trim().min(1, t("referralAdmin.validation.titleRequired")),
        subtitle: z.string().trim().min(1, t("referralAdmin.validation.subtitleRequired")),
        progressGoal: z.coerce.number().int().min(0, t("referralAdmin.validation.progressNonNegative")),
        progressHint: z.string().trim().min(1, t("referralAdmin.validation.hintRequired")),
        badges: z
          .array(z.object({ value: z.string() }))
          .refine((rows) => rows.some((r) => r.value.trim().length > 0), {
            message: t("referralAdmin.validation.badgeRequired"),
          }),
      }),
    [t, i18n.language],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      program: "",
      highlight: "",
      title: "",
      subtitle: "",
      progressGoal: 0,
      progressHint: "",
      badges: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "badges" });

  const createMutation = useMutation({
    mutationFn: createReferralProgram,
    onSuccess: (data) => {
      const codeLine =
        data.referralCode?.trim() &&
        `${t("referralAdmin.createdCodeTitle")}: ${data.referralCode.trim()}`;
      toast.success(t("referralAdmin.createSuccess"), {
        description: [codeLine, t("referralAdmin.createSuccessListHint")].filter(Boolean).join("\n\n"),
      });
      form.reset({
        program: "",
        highlight: "",
        title: "",
        subtitle: "",
        progressGoal: 0,
        progressHint: "",
        badges: [{ value: "" }],
      });
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e, t("referralAdmin.createFailed")));
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    const badges = values.badges.map((b) => b.value.trim()).filter(Boolean);
    createMutation.mutate({
      program: values.program.trim(),
      highlight: values.highlight.trim(),
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
      progressCurrent: 0,
      proggressGoal: values.progressGoal,
      progressHint: values.progressHint.trim(),
      badges,
    });
  });

  return (
    <div className="relative min-h-screen-dvh min-w-0 overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="landing-glow-orb absolute -left-[18%] top-[6%] size-[min(88vw,400px)] rounded-full bg-primary/14" />
        <div className="landing-glow-orb absolute -right-[12%] top-[32%] size-[min(80vw,360px)] rounded-full bg-accent/12 [animation-delay:-4s]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_-8%,hsl(var(--primary)_/_0.1),transparent_55%)]" />
      </div>

      <div className="relative z-10 px-safe pb-12 pt-[max(1rem,env(safe-area-inset-top))] sm:pb-16">
        <div className="container max-w-3xl">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10">
            <Link
              to={`${prefix}/dashboard`}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg text-sm font-medium text-primary transition hover:text-[hsl(var(--gradient-end))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              {t("referralAdmin.backToDashboard")}
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-primary/35 bg-primary/10 font-semibold text-primary">
                    <Shield className="mr-1 inline size-3.5" aria-hidden />
                    {t("referralAdmin.badgeAdmin")}
                  </Badge>
                  <Badge variant="outline" className="border-accent/40 text-[hsl(var(--gradient-end))]">
                    <Sparkles className="mr-1 inline size-3.5" aria-hidden />
                    {t("referralAdmin.badgeCreate")}
                  </Badge>
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t("referralAdmin.pageCreateTitle")}</h1>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("referralAdmin.pageCreateSubtitle")}</p>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-11 min-h-11 shrink-0 border-primary/35 bg-primary/5 font-semibold text-primary hover:bg-primary/10"
              >
                <Link to={`${prefix}/${ADMIN_REFERRALS_LIST_PATH}`} aria-label={t("referralAdmin.openListAria")}>
                  <ClipboardList className="mr-2 size-4" aria-hidden />
                  {t("referralAdmin.openList")}
                </Link>
              </Button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <Card className="overflow-hidden border-primary/25 shadow-lg shadow-primary/10">
              <CardHeader className="border-b border-border/80 bg-gradient-to-r from-primary/[0.08] via-primary/[0.03] to-transparent pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Hash className="size-4" aria-hidden />
                  </span>
                  {t("referralAdmin.sectionProgramId")}
                </CardTitle>
                <CardDescription>{t("referralAdmin.sectionProgramIdHint")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-5">
                <Label htmlFor="program" className="text-foreground">
                  {t("referralAdmin.fieldProgram")}
                </Label>
                <Input
                  id="program"
                  autoComplete="off"
                  placeholder={t("referralAdmin.placeholderProgram")}
                  className="h-11 border-primary/25 bg-background/80 font-mono text-sm"
                  {...form.register("program")}
                />
                {form.formState.errors.program ? (
                  <p className="text-xs text-destructive">{form.formState.errors.program.message}</p>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-md">
              <CardHeader className="border-b border-border/80 bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent/20 text-[hsl(var(--gradient-end))]">
                    <Type className="size-4" aria-hidden />
                  </span>
                  {t("referralAdmin.sectionContent")}
                </CardTitle>
                <CardDescription>{t("referralAdmin.sectionContentHint")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-2">
                  <Label htmlFor="highlight" className="flex items-center gap-2 text-foreground">
                    <TextQuote className="size-3.5 text-muted-foreground" aria-hidden />
                    {t("referralAdmin.fieldHighlight")}
                  </Label>
                  <Input id="highlight" className="h-11 border-primary/20" {...form.register("highlight")} />
                  {form.formState.errors.highlight ? (
                    <p className="text-xs text-destructive">{form.formState.errors.highlight.message}</p>
                  ) : null}
                </div>
                <Separator className="bg-border/80" />
                <div className="space-y-2">
                  <Label htmlFor="title">{t("referralAdmin.fieldTitle")}</Label>
                  <Input id="title" className="h-11 border-primary/20" {...form.register("title")} />
                  {form.formState.errors.title ? (
                    <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">{t("referralAdmin.fieldSubtitle")}</Label>
                  <Textarea
                    id="subtitle"
                    rows={3}
                    className="min-h-[5.5rem] resize-y border-primary/20"
                    {...form.register("subtitle")}
                  />
                  {form.formState.errors.subtitle ? (
                    <p className="text-xs text-destructive">{form.formState.errors.subtitle.message}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-md">
              <CardHeader className="border-b border-border/80 bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Target className="size-4" aria-hidden />
                  </span>
                  {t("referralAdmin.sectionProgressBadges")}
                </CardTitle>
                <CardDescription>{t("referralAdmin.sectionProgressBadgesHint")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                <div className="space-y-2">
                  <Label htmlFor="progressGoal">{t("referralAdmin.fieldProgressGoal")}</Label>
                  <Input
                    id="progressGoal"
                    type="number"
                    min={0}
                    className="h-11 max-w-[12rem] border-primary/20"
                    {...form.register("progressGoal")}
                  />
                  {form.formState.errors.progressGoal ? (
                    <p className="text-xs text-destructive">{form.formState.errors.progressGoal.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progressHint">{t("referralAdmin.fieldProgressHint")}</Label>
                  <Textarea id="progressHint" rows={2} className="border-primary/20" {...form.register("progressHint")} />
                  {form.formState.errors.progressHint ? (
                    <p className="text-xs text-destructive">{form.formState.errors.progressHint.message}</p>
                  ) : null}
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label className="flex items-center gap-2 text-foreground">
                      <Tags className="size-4 text-muted-foreground" aria-hidden />
                      {t("referralAdmin.fieldBadges")}
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1 border-primary/30"
                      onClick={() => append({ value: "" })}
                    >
                      <Plus className="size-3.5" aria-hidden />
                      {t("referralAdmin.addBadge")}
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {fields.map((field, index) => (
                      <li key={field.id} className="flex gap-2">
                        <Input
                          className="min-w-0 flex-1 border-primary/20"
                          placeholder={t("referralAdmin.placeholderBadge")}
                          aria-label={t("referralAdmin.badgeRowAria", { n: index + 1 })}
                          {...form.register(`badges.${index}.value`)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-11 min-h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive"
                          disabled={fields.length <= 1}
                          onClick={() => remove(index)}
                          aria-label={t("referralAdmin.removeBadgeAria")}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  {form.formState.errors.badges &&
                  typeof form.formState.errors.badges === "object" &&
                  "message" in form.formState.errors.badges &&
                  form.formState.errors.badges.message ? (
                    <p className="text-xs text-destructive">{String(form.formState.errors.badges.message)}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground sm:max-w-xs">{t("referralAdmin.submitFooterHint")}</p>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="h-12 min-h-11 w-full border-0 font-semibold gradient-primary text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-[0.97] sm:w-auto sm:min-w-[14rem]"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                    {t("referralAdmin.submitting")}
                  </>
                ) : (
                  t("referralAdmin.submit")
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgramsAdminPage;
