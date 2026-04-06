import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/lib/auth/admin";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";
import { Loader2 } from "lucide-react";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, initializing, user } = useAuth();
  const location = useLocation();
  const { prefix } = useLocalePrefix();
  const { t } = useTranslation();

  if (initializing) {
    return (
      <div className="flex min-h-screen-dvh min-w-0 items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label={t("common.loading")} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`${prefix}/`} replace state={{ from: location.pathname }} />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to={`${prefix}/dashboard`} replace />;
  }

  return <>{children}</>;
}
