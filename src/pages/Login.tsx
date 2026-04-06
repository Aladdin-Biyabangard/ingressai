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
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Github, Chrome, Eye, EyeOff } from "lucide-react";
import GitLabIcon from "@/components/icons/GitLabIcon";
import ChatButton from "@/components/chat/ChatButton";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/lib/utils/api/auth";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";
import { AUTH_REGISTER_SEGMENT } from "@/lib/auth/registerRoute";

type SignInValues = { email: string; password: string };

function LoginSignInPanel({
  schema,
  prefix,
  from,
}: {
  schema: z.ZodType<SignInValues>;
  prefix: string;
  from: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const result = await login({
        email: values.email.trim(),
        password: values.password,
      });
      if (result.kind === "requires_activation") {
        toast.message(t("login.toastActivateTitle"), {
          description: t("login.toastActivateDesc"),
        });
        navigate(
          `${prefix}/verify?email=${encodeURIComponent(result.email)}&purpose=ACCOUNT_ACTIVATION`,
          { replace: true },
        );
        return;
      }
      toast.success(t("login.signedIn"));
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(getApiErrorMessage(e, t("login.signInFailed")));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("common.email")}</Label>
        <Input id="email" type="email" className="h-11" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="password">{t("common.password")}</Label>
          <Link to={`${prefix}/forgot-password`} className="text-xs font-medium text-primary hover:underline">
            {t("login.forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="h-11 pr-10"
            autoComplete="current-password"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="h-11 w-full font-semibold gradient-primary text-primary-foreground"
        disabled={submitting}
      >
        {submitting ? t("login.signingIn") : t("login.signIn")}
      </Button>
    </form>
  );
}

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { prefix } = useLocalePrefix();
  const { isAuthenticated, initializing } = useAuth();

  const from =
    (location.state as { from?: string } | null)?.from ?? `${prefix}/dashboard`;

  const signInSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("validation.emailInvalid")),
        password: z.string().min(1, t("validation.passwordRequired")),
      }),
    [t],
  );

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, initializing, isAuthenticated, navigate]);

  const handleOAuth = (provider: string) => {
    toast.message(t("login.oauthToastTitle", { provider }), {
      description: t("login.oauthToastDesc"),
    });
  };

  return (
    <div className="flex min-h-screen-dvh min-w-0">
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden gradient-primary p-12 lg:flex">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-20 top-20 h-72 w-72 animate-float rounded-full bg-primary-foreground" />
          <div
            className="absolute bottom-32 right-16 h-48 w-48 animate-float rounded-full bg-primary-foreground"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute left-1/3 top-1/2 h-32 w-32 animate-float rounded-full bg-primary-foreground"
            style={{ animationDelay: "4s" }}
          />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-primary-foreground">{t("common.brand")}</h1>
          <p className="text-lg leading-relaxed text-primary-foreground/80">{t("login.heroSubtitle")}</p>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-1 items-center justify-center px-safe py-6 sm:p-12">
        <div className="absolute right-[max(1rem,env(safe-area-inset-right,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] z-10 sm:right-6 sm:top-6">
          <LanguageSwitcher variant="minimal" />
        </div>
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">{t("common.brand")}</span>
          </div>

          <Card className="border-0 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-1 pb-4">
              <h2 className="text-2xl font-bold tracking-tight">{t("login.welcomeBack")}</h2>
              <p className="text-sm text-muted-foreground">{t("login.signInSubtitle")}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="h-11" type="button" onClick={() => handleOAuth("Google")}>
                  <Chrome className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-11" type="button" onClick={() => handleOAuth("GitHub")}>
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-11" type="button" onClick={() => handleOAuth("GitLab")}>
                  <GitLabIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  {t("login.orContinueEmail")}
                </span>
              </div>

              <LoginSignInPanel key={i18n.language} schema={signInSchema} prefix={prefix} from={from} />

              <p className="text-center text-sm text-muted-foreground">
                {t("login.noAccount")}{" "}
                <Link
                  to={`${prefix}/${AUTH_REGISTER_SEGMENT}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {t("login.toggleSignUp")}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatButton />
    </div>
  );
};

export default Login;
