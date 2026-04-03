import { useState } from "react";
import { MessageCircle, X, Bot } from "lucide-react";
import { HelpCenterConversation } from "@/components/chat/HelpCenterConversation";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed fixed-fab-br z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        {open ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {open && (
        <div className="fixed z-50 flex w-auto max-h-[min(560px,calc(100dvh-6rem-env(safe-area-inset-bottom,0px)))] animate-slide-up flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] left-4 right-4 sm:left-auto sm:right-[calc(1.5rem+env(safe-area-inset-right,0px))] sm:w-[360px] sm:max-w-[min(360px,calc(100vw-2rem-env(safe-area-inset-left,0px)-env(safe-area-inset-right,0px)))]">
          <div className="gradient-primary px-5 py-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground text-sm">Help Centre</h3>
                <p className="text-primary-foreground/70 text-xs">Online • Typically replies instantly</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <HelpCenterConversation variant="widget" />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
