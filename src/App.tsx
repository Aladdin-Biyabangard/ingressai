import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalDataProvider } from "@/contexts/GlobalDataContext";
import { LocaleLayout } from "@/components/i18n/LocaleLayout";
import i18n from "@/lib/i18n/instance";
import { getStoredOrDefaultLocale } from "@/lib/i18n/constants";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <GlobalDataProvider>
              <Routes>
                <Route path="/" element={<Navigate to={`/${getStoredOrDefaultLocale()}`} replace />} />
                <Route path="/:lang" element={<LocaleLayout />}>
                  <Route index element={<Login />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="verify" element={<VerifyCode />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="chat"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </GlobalDataProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </I18nextProvider>
);

export default App;
