import { useNavigate } from "react-router-dom";
import { Bot, Sparkles } from "lucide-react";
import { tHelp } from "@/lib/helpCenterCopy";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";

const ChatButton = () => {
  const navigate = useNavigate();
  const { prefix } = useLocalePrefix();

  return (
    <button
      type="button"
      onClick={() => navigate(`${prefix}/chat`)}
      className="fixed fixed-fab-br z-50 flex max-w-[min(19rem,calc(100vw-1.25rem-env(safe-area-inset-left)-env(safe-area-inset-right)))] items-center gap-0 rounded-full border border-primary-foreground/25 bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] p-1.5 pl-1.5 pr-3 shadow-lg shadow-primary/30 ring-2 ring-primary/25 transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:pr-4"
      aria-label={tHelp("helpCenterFabAria")}
    >
      <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
        <Bot className="relative z-10 h-5 w-5 text-primary-foreground" aria-hidden />
        <Sparkles
          className="absolute -right-0.5 -top-0.5 z-10 h-4 w-4 text-amber-200 drop-shadow"
          aria-hidden
          strokeWidth={2.25}
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5 py-0.5 pl-1.5 text-left text-primary-foreground sm:pl-2">
        <span className="flex w-full min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold leading-tight tracking-tight sm:text-[0.95rem]">
            {tHelp("helpCenterFabHeadline")}
          </span>
          <span className="hidden shrink-0 items-center gap-1 rounded-full bg-emerald-400/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-950 shadow-sm sm:inline-flex">
            <span className="size-1.5 rounded-full bg-emerald-800 motion-safe:animate-pulse" aria-hidden />
            {tHelp("helpCenterFabBadge")}
          </span>
        </span>
        <span className="hidden w-full truncate text-xs leading-snug text-primary-foreground/90 sm:block">
          {tHelp("helpCenterFabSubline")}
        </span>
      </span>
    </button>
  );
};

export default ChatButton;
