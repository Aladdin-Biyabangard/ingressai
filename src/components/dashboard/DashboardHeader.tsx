import { useTranslation } from "react-i18next";
import { GraduationCap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
const DashboardHeader = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-safe sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden truncate text-xl font-bold gradient-text sm:block">{t("common.brand")}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <LanguageSwitcher variant="minimal" />
            <Button variant="ghost" size="icon" className="relative h-10 w-10 sm:h-9 sm:w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-destructive" />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-semibold">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
