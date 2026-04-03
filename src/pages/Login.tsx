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
import { createPasswordFieldSchema } from "@/lib/auth/passwordSchema";
import { getApiErrorMessage, signUp } from "@/lib/utils/api/auth";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";

type SignInValues = { email: string; password: string };
type SignUpValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full h-11 gradient-primary font-semibold text-primary-foreground"
        disabled={submitting}
      >
        {submitting ? t("login.signingIn") : t("login.signIn")}
      </Button>
    </form>
  );
}

function LoginSignUpPanel({ schema, prefix }: { schema: z.ZodType<SignUpValues>; prefix: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordB, setShowPasswordB] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await signUp({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
        passwordConfirm: values.passwordConfirm,
      });
      toast.success(t("login.accountCreated"));
      navigate(
        `${prefix}/verify?email=${encodeURIComponent(values.email.trim())}&purpose=ACCOUNT_ACTIVATION`,
        { replace: true },
      );
    } catch (e) {
      toast.error(getApiErrorMessage(e, t("login.signUpFailed")));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("login.firstName")}</Label>
          <Input id="firstName" className="h-11" autoComplete="given-name" {...form.register("firstName")} />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("login.lastName")}</Label>
          <Input id="lastName" className="h-11" autoComplete="family-name" {...form.register("lastName")} />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-email">{t("common.email")}</Label>
        <Input id="su-email" type="email" className="h-11" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-password">{t("common.password")}</Label>
        <p className="text-xs text-muted-foreground">{t("validation.passwordRequirement")}</p>
        <div className="relative">
          <Input
            id="su-password"
            type={showPassword ? "text" : "password"}
            className="h-11 pr-10"
            autoComplete="new-password"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-password2">{t("login.confirmPassword")}</Label>
        <div className="relative">
          <Input
            id="su-password2"
            type={showPasswordB ? "text" : "password"}
            className="h-11 pr-10"
            autoComplete="new-password"
            {...form.register("passwordConfirm")}
          />
          <button
            type="button"
            onClick={() => setShowPasswordB(!showPasswordB)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPasswordB ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {form.formState.errors.passwordConfirm && (
          <p className="text-sm text-destructive">{form.formState.errors.passwordConfirm.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full h-11 gradient-primary font-semibold text-primary-foreground"
        disabled={submitting}
      >
        {submitting ? t("login.creating") : t("login.createAccountBtn")}
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
  const [isSignUp, setIsSignUp] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from ?? `${prefix}/dashboard`;

  const passwordFieldSchema = useMemo(
    () =>
      createPasswordFieldSchema({
        requirement: t("validation.passwordRequirement"),
        maxLength: t("validation.passwordMax"),
      }),
    [t],
  );

  const signInSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("validation.emailInvalid")),
        password: z.string().min(1, t("validation.passwordRequired")),
      }),
    [t],
  );

  const signUpSchema = useMemo(
    () =>
      z
        .object({
          firstName: z.string().min(1, t("validation.firstNameRequired")),
          lastName: z.string().min(1, t("validation.lastNameRequired")),
          email: z.string().email(t("validation.emailInvalid")),
          password: passwordFieldSchema,
          passwordConfirm: z.string().min(1, t("validation.confirmPasswordRequired")),
        })
        .refine((d) => d.password === d.passwordConfirm, {
          message: t("validation.passwordsMismatch"),
          path: ["passwordConfirm"],
        }),
    [t, passwordFieldSchema],
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
    <div className="min-h-screen-dvh flex min-w-0">
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary-foreground animate-float" />
          <div
            className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-primary-foreground animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-primary-foreground animate-float"
            style={{ animationDelay: "4s" }}
          />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/20 mb-8">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">{t("common.brand")}</h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">{t("login.heroSubtitle")}</p>
        </div>
      </div>

      <div className="relative flex-1 flex min-w-0 items-center justify-center px-safe py-6 sm:p-12">
        <div className="absolute right-[max(1rem,env(safe-area-inset-right,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] sm:right-6 sm:top-6 z-10">
          <LanguageSwitcher variant="minimal" />
        </div>
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">{t("common.brand")}</span>
          </div>

          <Card className="border-0 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-1 pb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                {isSignUp ? t("login.createAccount") : t("login.welcomeBack")}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isSignUp ? t("login.signUpSubtitle") : t("login.signInSubtitle")}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="h-11" type="button" onClick={() => handleOAuth("Google")}>
                  <Chrome className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="h-11" type="button" onClick={() => handleOAuth("GitHub")}>
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="h-11" type="button" onClick={() => handleOAuth("GitLab")}>
                  <GitLabIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  {t("login.orContinueEmail")}
                </span>
              </div>

              {isSignUp ? (
                <LoginSignUpPanel key={i18n.language} schema={signUpSchema} prefix={prefix} />
              ) : (
                <LoginSignInPanel key={i18n.language} schema={signInSchema} prefix={prefix} from={from} />
              )}

              <p className="text-center text-sm text-muted-foreground">
                {isSignUp ? t("login.alreadyHaveAccount") : t("login.noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-semibold text-primary hover:underline"
                >
                  {isSignUp ? t("login.toggleSignIn") : t("login.toggleSignUp")}
                </button>
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
