import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap, Bell, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";

function initials(user: { firstName: string; lastName: string }): string {
  const a = user.firstName?.trim().charAt(0) ?? "";
  const b = user.lastName?.trim().charAt(0) ?? "";
  const s = `${a}${b}`.toUpperCase();
  return s || "U";
}

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { prefix } = useLocalePrefix();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(`${prefix}/`, { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 glass border-b pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto max-w-7xl px-safe sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden truncate text-xl font-bold gradient-text sm:block">{t("common.brand")}</span>
          </div>

          <div className="mx-4 hidden min-w-0 max-w-md flex-1 items-center md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("dashboard.searchPlaceholder")}
                className="h-10 border-0 bg-secondary/50 pl-10 focus-visible:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <LanguageSwitcher variant="minimal" className="hidden sm:flex" />
            <Button variant="ghost" size="icon" className="relative h-10 w-10 sm:h-9 sm:w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-destructive" />
            </Button>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-semibold">
                {user ? initials(user) : "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-10 w-10 text-muted-foreground hover:text-destructive sm:h-9 sm:w-9"
              aria-label={t("dashboard.signOutAria")}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="border-t border-border/60 pb-3 pt-2 md:hidden">
          <div className="mb-2 flex justify-end">
            <LanguageSwitcher variant="minimal" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("dashboard.searchPlaceholder")}
              className="h-10 w-full border-0 bg-secondary/50 pl-10 focus-visible:ring-primary/30"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
