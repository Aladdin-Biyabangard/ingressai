import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalePrefix } from "@/hooks/useLocalePrefix";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  const { prefix } = useLocalePrefix();
  const { t } = useTranslation();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label={t("common.loading")} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`${prefix}/`} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
