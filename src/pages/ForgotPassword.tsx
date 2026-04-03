import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { forgotPassword, getApiErrorMessage } from "@/lib/utils/api/auth";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";

type FormValues = { email: string };

function ForgotPasswordForm({ schema, prefix }: { schema: z.ZodType<FormValues>; prefix: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await forgotPassword(values.email.trim());
      toast.success(t("forgotPassword.toastSent"));
      navigate(`${prefix}/verify?email=${encodeURIComponent(values.email.trim())}&purpose=PASSWORD_RESET`, {
        replace: true,
      });
    } catch (e) {
      toast.error(getApiErrorMessage(e, t("forgotPassword.sendFailed")));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("common.email")}</Label>
        <Input id="email" type="email" autoComplete="email" className="h-11" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full h-11 gradient-primary font-semibold text-primary-foreground" disabled={submitting}>
        {submitting ? t("forgotPassword.sending") : t("forgotPassword.sendCode")}
      </Button>
    </form>
  );
}

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const { prefix } = useLocalePrefix();

  const schema = useMemo(
    () => z.object({ email: z.string().email(t("validation.emailInvalid")) }),
    [t],
  );

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
            <h1 className="text-2xl font-bold tracking-tight">{t("forgotPassword.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("forgotPassword.subtitle")}</p>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm key={i18n.language} schema={schema} prefix={prefix} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
