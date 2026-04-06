"use client";

import { I18nProviderClient } from "@/locales/client";
import { GlobalDataProvider } from "@/contexts/GlobalDataContext";
import AmplitudeProvider from "@/contexts/AmplitudeProvider";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AppProviders({ children, locale }) {
  return (
    <I18nProviderClient locale={locale}>
      <GlobalDataProvider>
        <AmplitudeProvider />
        <GoogleTagManager
          gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}
        />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
        />
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </GlobalDataProvider>
    </I18nProviderClient>
  );
}
