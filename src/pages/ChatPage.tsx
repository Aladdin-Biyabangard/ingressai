import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bot, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { HelpCenterConversation } from "@/components/chat/HelpCenterConversation";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";
import { cn } from "@/lib/utils";

const ChatPage = () => {
  const navigate = useNavigate();
  const { prefix } = useLocalePrefix();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen-dvh h-dvh min-w-0 flex-col overflow-hidden bg-background">
      <header className="gradient-primary shrink-0 shadow-md">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-safe py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:gap-4 sm:px-6 sm:py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(`${prefix}/dashboard`)}
            aria-label={t("chatPage.leaveChatAria")}
            className="h-11 min-h-11 shrink-0 gap-2 px-2 text-primary-foreground hover:bg-primary-foreground/10 sm:h-10 sm:min-h-0 sm:px-3"
          >
            <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
            <span className="hidden text-sm font-medium sm:inline">{t("chatPage.leaveChat")}</span>
          </Button>

          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/20 ring-2 ring-primary-foreground/25">
            <Bot className="h-5 w-5 text-primary-foreground" aria-hidden />
            <Sparkles
              className="absolute -right-1 -top-1 h-4 w-4 text-amber-200 drop-shadow"
              aria-hidden
              strokeWidth={2.25}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 gap-y-1">
              <h1 className="truncate text-base font-semibold tracking-tight text-primary-foreground sm:text-lg">
                {t("chatPage.title")}
              </h1>
              <span className="hidden items-center gap-1.5 rounded-full bg-emerald-400/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-950 shadow-sm sm:inline-flex">
                <span
                  className="size-1.5 rounded-full bg-emerald-800 motion-safe:animate-pulse"
                  aria-hidden
                />
                {t("chatPage.badgeLive")}
              </span>
            </div>
            <p className="line-clamp-2 text-xs leading-snug text-primary-foreground/80 sm:line-clamp-1">
              {t("chatPage.subtitle")}
            </p>
          </div>

          <div
            className={cn(
              "shrink-0 rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 p-0.5",
              "shadow-sm backdrop-blur-sm",
            )}
          >
            <LanguageSwitcher variant="minimal" className="border-0 bg-transparent" />
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <HelpCenterConversation variant="page" />
      </div>
    </div>
  );
};

export default ChatPage;
