import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import ChatButton from "@/components/chat/ChatButton";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  type OtpPurpose,
  getApiErrorMessage,
  resendOtp,
  verifyOtp,
} from "@/lib/utils/api/auth";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";
import { ArrowLeft, GraduationCap, Loader2, Mail, ShieldCheck } from "lucide-react";

const PURPOSES: OtpPurpose[] = ["ACCOUNT_ACTIVATION", "PASSWORD_RESET", "EMAIL_CHANGE"];

function parsePurpose(raw: string | null): OtpPurpose {
  if (raw && PURPOSES.includes(raw as OtpPurpose)) return raw as OtpPurpose;
  return "ACCOUNT_ACTIVATION";
}

const slotClass =
  "h-9 w-9 text-sm font-semibold sm:h-11 sm:w-11 sm:text-base md:h-12 md:w-12 md:text-lg rounded-md border-2 first:rounded-l-lg last:rounded-r-lg";

const VerifyCode = () => {
  const { t } = useTranslation();
  const { applyAuthResponse } = useAuth();
  const { prefix } = useLocalePrefix();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailFromUrl = (searchParams.get("email") ?? "").trim();
  const purpose = parsePurpose(searchParams.get("purpose"));
  const [emailInput, setEmailInput] = useState(emailFromUrl);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    setEmailInput(emailFromUrl);
  }, [emailFromUrl]);

  const panel = useMemo(() => {
    const base = `verify.${purpose}` as const;
    return {
      eyebrow: t(`${base}.eyebrow`),
      title: t(`${base}.title`),
      body: t(`${base}.body`),
    };
  }, [purpose, t]);

  const cardTitle = useMemo(() => {
    if (purpose === "PASSWORD_RESET") return t("verify.cardTitleReset");
    if (purpose === "EMAIL_CHANGE") return t("verify.cardTitleEmail");
    return t("verify.cardTitleActivation");
  }, [purpose, t]);

  const codeDigits = code.replace(/\s/g, "");
  const emailOk = Boolean(emailInput.trim());
  const codeComplete = codeDigits.length === 6;
  const canSubmit = emailOk && codeComplete && !submitting;
  const canResend = emailOk && !resending && !submitting;

  const runVerify = async () => {
    const trimmed = emailInput.trim();
    if (!trimmed) {
      toast.error(t("verify.toastEmailRequired"));
      return;
    }
    if (codeDigits.length !== 6 || !/^\d{6}$/.test(codeDigits)) {
      toast.error(t("verify.toastDigits"));
      return;
    }
    const otpCode = Number.parseInt(codeDigits, 10);
    if (!Number.isSafeInteger(otpCode)) {
      toast.error(t("verify.toastInvalidCode"));
      return;
    }
    setSubmitting(true);
    try {
      const auth = await verifyOtp({ email: trimmed, otpCode });
      toast.success(t("verify.verified"));
      if (purpose === "PASSWORD_RESET") {
        applyAuthResponse(auth);
        navigate(`${prefix}/reset-password`, { replace: true, state: { email: trimmed } });
        return;
      }
      if (purpose === "ACCOUNT_ACTIVATION") {
        navigate(`${prefix}/`, { replace: true });
        return;
      }
      applyAuthResponse(auth);
      navigate(`${prefix}/dashboard`, { replace: true });
    } catch (e) {
      toast.error(getApiErrorMessage(e, t("verify.verifyFailed")));
      setCode("");
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    const trimmed = emailInput.trim();
    if (!trimmed) {
      toast.error(t("verify.toastResendEmail"));
      return;
    }
    setResending(true);
    try {
      await resendOtp({ email: trimmed, purpose });
      toast.success(t("verify.newCodeSent"));
      setCode("");
    } catch (e) {
      toast.error(getApiErrorMessage(e, t("verify.resendFailed")));
    } finally {
      setResending(false);
    }
  };

  const emailLocked = Boolean(emailFromUrl);

  return (
    <div className="min-h-screen-dvh flex min-w-0 bg-background">
      <div className="hidden lg:flex lg:w-[46%] xl:w-1/2 gradient-primary relative items-center justify-center p-10 xl:p-14 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12]">
          <div className="absolute top-16 left-12 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-24 right-8 w-48 h-48 rounded-full bg-primary-foreground blur-2xl" />
        </div>
        <div className="relative z-10 max-w-md">
          <p className="text-primary-foreground/70 text-sm font-medium tracking-wide uppercase mb-3">{panel.eyebrow}</p>
          <h1 className="text-3xl xl:text-4xl font-bold text-primary-foreground leading-tight mb-4">{panel.title}</h1>
          <p className="text-primary-foreground/85 text-base leading-relaxed">{panel.body}</p>
          <div className="mt-10 flex items-center gap-3 text-primary-foreground/90 text-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </div>
            <span>{t("verify.codeHint")}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-w-0 flex-col min-h-screen-dvh">
        <header className="flex items-center justify-between gap-4 px-safe sm:px-8 pb-2 pt-[max(1.25rem,env(safe-area-inset-top,0px))] sm:pt-6">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground -ml-2" asChild>
            <Link to={`${prefix}/`}>
              <ArrowLeft className="h-4 w-4" />
              {t("common.backToSignIn")}
            </Link>
          </Button>
          <LanguageSwitcher variant="minimal" />
        </header>

        <div className="flex-1 flex min-w-0 items-center justify-center px-safe sm:px-8 pb-safe pb-12 pt-4">
          <div className="w-full max-w-[420px] animate-slide-up">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-md shadow-primary/20">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">{t("common.brand")}</span>
            </div>

            <Card className="border border-border/60 shadow-xl shadow-primary/[0.06] overflow-hidden">
              <CardHeader className="space-y-3 pb-2 pt-8 px-6 sm:px-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="h-7 w-7" aria-hidden />
                </div>
                <div className="text-center space-y-1.5">
                  <CardTitle className="text-2xl font-bold tracking-tight">{cardTitle}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {emailLocked ? (
                      <>
                        {t("verify.sentToPrefix")}{" "}
                        <span className="font-medium text-foreground">{emailInput}</span>
                      </>
                    ) : (
                      t("verify.addEmailHint")
                    )}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8 pt-4 space-y-8">
                <form
                  className="space-y-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void runVerify();
                  }}
                >
                  {!emailLocked ? (
                    <div className="space-y-2">
                      <Label htmlFor="verify-email" className="text-sm font-medium">
                        {t("verify.emailAddress")}
                      </Label>
                      <Input
                        id="verify-email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder={t("verify.emailPlaceholder")}
                        className="h-12 text-base"
                        value={emailInput}
                        onChange={(ev) => setEmailInput(ev.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">{t("verify.sameEmailHint")}</p>
                    </div>
                  ) : (
                    <div
                      className="rounded-xl border border-border/80 bg-muted/30 px-4 py-3.5 flex gap-3 items-start"
                      aria-live="polite"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background border border-border/60">
                        <Mail className="h-4 w-4 text-primary" aria-hidden />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {t("verify.sendingTo")}
                        </p>
                        <p className="text-sm font-semibold text-foreground break-all leading-snug mt-0.5">{emailInput}</p>
                        <button
                          type="button"
                          className="text-xs font-medium text-primary hover:underline mt-2"
                          onClick={() => navigate(`${prefix}/`, { replace: true })}
                        >
                          {t("verify.wrongEmail")}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-sm font-medium">{t("verify.sixDigitCode")}</Label>
                      <span className={cn("text-xs font-medium", codeComplete ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                        {codeDigits.length}/6
                      </span>
                    </div>
                    <div className="flex justify-center py-1">
                      <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={setCode}
                        autoFocus
                        containerClassName="gap-1 sm:gap-2 md:gap-3 justify-center max-w-full"
                        aria-label={t("verify.otpAria")}
                      >
                        <InputOTPGroup className="gap-1.5 sm:gap-2">
                          <InputOTPSlot index={0} className={slotClass} />
                          <InputOTPSlot index={1} className={slotClass} />
                          <InputOTPSlot index={2} className={slotClass} />
                        </InputOTPGroup>
                        <InputOTPSeparator className="text-muted-foreground/40 px-0.5" />
                        <InputOTPGroup className="gap-1.5 sm:gap-2">
                          <InputOTPSlot index={3} className={slotClass} />
                          <InputOTPSlot index={4} className={slotClass} />
                          <InputOTPSlot index={5} className={slotClass} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-center text-xs text-muted-foreground leading-relaxed">{t("verify.spamHint")}</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground shadow-md shadow-primary/15"
                      disabled={!canSubmit}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
                          {t("verify.verifying")}
                        </>
                      ) : (
                        t("verify.verifyContinue")
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      {t("verify.resendPrompt")}{" "}
                      <button
                        type="button"
                        className={cn(
                          "font-semibold text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none inline p-0 bg-transparent border-0 cursor-pointer",
                        )}
                        disabled={!canResend}
                        onClick={resend}
                      >
                        {resending ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                            {t("verify.resending")}
                          </span>
                        ) : (
                          t("verify.resend")
                        )}
                      </button>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ChatButton />
    </div>
  );
};

export default VerifyCode;
