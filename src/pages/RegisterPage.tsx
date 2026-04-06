import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import {
  getApiErrorMessage,
  signUp,
  validateReferralCode,
  type SignUpReferralParams,
} from "@/lib/utils/api/auth";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";

type SignUpValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type RegisterStep = "referral" | "details";

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { prefix } = useLocalePrefix();
  const { isAuthenticated, initializing } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordB, setShowPasswordB] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inviteRef = searchParams.get("ref")?.trim() || undefined;
  const inviteProgram = searchParams.get("program")?.trim() || undefined;

  const [registerStep, setRegisterStep] = useState<RegisterStep>("referral");
  const [refCodeDraft, setRefCodeDraft] = useState(() => searchParams.get("ref")?.trim() ?? "");
  const [resolvedReferral, setResolvedReferral] = useState<SignUpReferralParams | undefined>(undefined);
  const [referralChecking, setReferralChecking] = useState(false);

  const referralFromUrlOnly = (): SignUpReferralParams | undefined =>
    inviteRef || inviteProgram ? { ref: inviteRef, program: inviteProgram } : undefined;

  const handleReferralSkip = () => {
    setResolvedReferral(referralFromUrlOnly());
    setRegisterStep("details");
  };

  const handleReferralContinue = async () => {
    const trimmed = refCodeDraft.trim();
    if (!trimmed) {
      setResolvedReferral(referralFromUrlOnly());
      setRegisterStep("details");
      return;
    }
    setReferralChecking(true);
    try {
      await validateReferralCode(trimmed);
      setResolvedReferral({ ref: trimmed, program: inviteProgram });
      setRegisterStep("details");
    } catch (e) {
      toast.error(getApiErrorMessage(e, t("login.referralInvalid")));
    } finally {
      setReferralChecking(false);
    }
  };

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

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

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

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await signUp(
        {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        },
        resolvedReferral?.ref || resolvedReferral?.program ? resolvedReferral : undefined,
      );
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
              <h2 className="text-2xl font-bold tracking-tight">
                {registerStep === "referral" ? t("login.referralStepTitle") : t("login.createAccount")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {registerStep === "referral" ? t("login.referralStepSubtitle") : t("login.signUpSubtitle")}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {registerStep === "referral" ? (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleReferralContinue();
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="reg-referral-code">{t("login.referralCodeLabel")}</Label>
                    <Input
                      id="reg-referral-code"
                      className="h-11"
                      autoComplete="off"
                      placeholder={t("login.referralCodePlaceholder")}
                      value={refCodeDraft}
                      onChange={(e) => setRefCodeDraft(e.target.value)}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button
                      type="submit"
                      className="h-11 min-h-11 w-full font-semibold gradient-primary text-primary-foreground sm:min-w-[8rem] sm:flex-1"
                      disabled={referralChecking}
                    >
                      {referralChecking ? t("login.referralValidating") : t("login.referralContinue")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 min-h-11 w-full sm:min-w-[8rem] sm:flex-1"
                      onClick={handleReferralSkip}
                      disabled={referralChecking}
                    >
                      {t("login.referralSkip")}
                    </Button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("login.alreadyHaveAccount")}{" "}
                    <Link to={`${prefix}/`} className="font-semibold text-primary hover:underline">
                      {t("login.toggleSignIn")}
                    </Link>
                  </p>
                </form>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 min-h-11 w-full justify-start px-2 text-muted-foreground hover:text-foreground sm:w-auto"
                    onClick={() => setRegisterStep("referral")}
                  >
                    {t("login.backToReferralStep")}
                  </Button>

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

                  <form key={i18n.language} onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reg-firstName">{t("login.firstName")}</Label>
                    <Input id="reg-firstName" className="h-11" autoComplete="given-name" {...form.register("firstName")} />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-lastName">{t("login.lastName")}</Label>
                    <Input id="reg-lastName" className="h-11" autoComplete="family-name" {...form.register("lastName")} />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t("common.email")}</Label>
                  <Input id="reg-email" type="email" className="h-11" autoComplete="email" {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t("common.password")}</Label>
                  <p className="text-xs text-muted-foreground">{t("validation.passwordRequirement")}</p>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      className="h-11 pr-10"
                      autoComplete="new-password"
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
                <div className="space-y-2">
                  <Label htmlFor="reg-password2">{t("login.confirmPassword")}</Label>
                  <div className="relative">
                    <Input
                      id="reg-password2"
                      type={showPasswordB ? "text" : "password"}
                      className="h-11 pr-10"
                      autoComplete="new-password"
                      {...form.register("passwordConfirm")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordB(!showPasswordB)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPasswordB ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.passwordConfirm && (
                    <p className="text-sm text-destructive">{form.formState.errors.passwordConfirm.message}</p>
                  )}
                </div>
                    <Button
                      type="submit"
                      className="h-11 w-full font-semibold gradient-primary text-primary-foreground"
                      disabled={submitting}
                    >
                      {submitting ? t("login.creating") : t("login.createAccountBtn")}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground">
                    {t("login.alreadyHaveAccount")}{" "}
                    <Link to={`${prefix}/`} className="font-semibold text-primary hover:underline">
                      {t("login.toggleSignIn")}
                    </Link>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatButton />
    </div>
  );
};

export default RegisterPage;
