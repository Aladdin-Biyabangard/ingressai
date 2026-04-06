import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Bell, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/lib/auth/admin";
import { ADMIN_REFERRALS_LIST_PATH } from "@/lib/admin/referralAdminRoutes";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";

const DashboardHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { prefix } = useLocalePrefix();
  const { user, logout } = useAuth();

  const initials = useMemo(() => {
    if (!user) return "U";
    const a = user.firstName?.trim()?.[0] ?? "";
    const b = user.lastName?.trim()?.[0] ?? "";
    const pair = `${a}${b}`.toUpperCase();
    return pair || "U";
  }, [user]);

  const handleSignOut = async () => {
    await logout();
    navigate(`${prefix}/`, { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-safe sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden truncate text-xl font-bold gradient-text sm:block">{t("common.brand")}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {isAdminUser(user) ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden h-10 border-primary/35 bg-primary/5 font-semibold text-primary hover:bg-primary/10 sm:inline-flex"
                >
                  <Link to={`${prefix}/${ADMIN_REFERRALS_LIST_PATH}`} aria-label={t("referralAdmin.headerLinkAria")}>
                    <Shield className="mr-1.5 size-4 shrink-0" aria-hidden />
                    {t("referralAdmin.headerLink")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="h-11 min-h-11 w-11 border-primary/35 bg-primary/5 text-primary hover:bg-primary/10 sm:hidden"
                  aria-label={t("referralAdmin.headerLinkAria")}
                >
                  <Link to={`${prefix}/${ADMIN_REFERRALS_LIST_PATH}`}>
                    <Shield className="size-5" />
                  </Link>
                </Button>
              </>
            ) : null}
            <LanguageSwitcher variant="minimal" />
            <Button variant="ghost" size="icon" className="relative h-10 w-10 sm:h-9 sm:w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-destructive" />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="ghost"
              className="h-11 min-h-11 shrink-0 gap-2 px-2 sm:h-9 sm:min-h-0 sm:px-3"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden />
              <span className="sr-only sm:not-sr-only sm:truncate">{t("dashboard.signOut")}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
