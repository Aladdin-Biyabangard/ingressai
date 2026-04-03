import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { createPasswordFieldSchema } from "@/lib/auth/passwordSchema";
import { getApiErrorMessage, resetPassword } from "@/lib/utils/api/auth";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";

type FormValues = { newPassword: string; retryPassword: string };

type LocationState = { email?: string } | null;

function ResetPasswordForm({ schema, prefix, email }: { schema: z.ZodType<FormValues>; prefix: string; email: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", retryPassword: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await resetPassword({
        email,
        newPassword: values.newPassword,
        retryPassword: values.retryPassword,
      });
      toast.success(t("resetPassword.success"));
      navigate(`${prefix}/`, { replace: true });
    } catch (e) {
      toast.error(getApiErrorMessage(e, t("resetPassword.failed")));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="np">{t("resetPassword.newPassword")}</Label>
        <div className="relative">
          <Input
            id="np"
            type={showA ? "text" : "password"}
            autoComplete="new-password"
            className="h-11 pr-10"
            {...form.register("newPassword")}
          />
          <button
            type="button"
            onClick={() => setShowA(!showA)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showA ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {form.formState.errors.newPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="rp">{t("login.confirmPassword")}</Label>
        <div className="relative">
          <Input
            id="rp"
            type={showB ? "text" : "password"}
            autoComplete="new-password"
            className="h-11 pr-10"
            {...form.register("retryPassword")}
          />
          <button
            type="button"
            onClick={() => setShowB(!showB)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showB ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {form.formState.errors.retryPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.retryPassword.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full h-11 gradient-primary font-semibold text-primary-foreground"
        disabled={submitting}
      >
        {submitting ? t("resetPassword.saving") : t("resetPassword.update")}
      </Button>
    </form>
  );
}

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { prefix } = useLocalePrefix();
  const location = useLocation();
  const state = location.state as LocationState;
  const email = (state?.email ?? "").trim();

  const passwordFieldSchema = useMemo(
    () =>
      createPasswordFieldSchema({
        requirement: t("validation.passwordRequirement"),
        maxLength: t("validation.passwordMax"),
      }),
    [t],
  );

  const schema = useMemo(
    () =>
      z
        .object({
          newPassword: passwordFieldSchema,
          retryPassword: z.string().min(1, t("validation.confirmNewPassword")),
        })
        .refine((d) => d.newPassword === d.retryPassword, {
          message: t("validation.passwordsMismatch"),
          path: ["retryPassword"],
        }),
    [t, passwordFieldSchema],
  );

  useEffect(() => {
    if (!email) {
      toast.error(t("resetPassword.toastStartOver"));
      navigate(`${prefix}/forgot-password`, { replace: true });
    }
  }, [email, navigate, prefix, t]);

  if (!email) return null;

  return (
    <div className="min-h-screen-dvh flex min-w-0 flex-col items-center justify-center px-safe py-6 bg-background">
      <div className="absolute right-[max(1rem,env(safe-area-inset-right,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] sm:right-6 sm:top-6 z-10">
        <LanguageSwitcher variant="minimal" />
      </div>
      <Link
        to={`${prefix}/`}
        className="absolute absolute-back-tl inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("common.backToSignIn")}
      </Link>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold gradient-text">{t("common.brand")}</span>
        </div>
        <Card className="border-0 shadow-xl shadow-primary/5">
          <CardHeader className="space-y-1 pb-4">
            <h1 className="text-2xl font-bold tracking-tight">{t("resetPassword.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("validation.passwordRequirement")}</p>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm key={i18n.language} schema={schema} prefix={prefix} email={email} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
