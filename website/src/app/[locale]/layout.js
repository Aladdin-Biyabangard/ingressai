import { use } from "react";

import AppProviders from "./providers";
import LayoutShell from "@/components/shared/layout-shell/LayoutShell";

import "../globals.css";

export const metadata = {
  title: "Ingress Academy",
  icons: {
    icon: [{ url: "/en/favicon.ico" }, { url: "/icon.svg" }],
    apple: [{ url: "/en/apple-icon.svg" }],
  },
  other: {
    "google-site-verification":
      "ARdGi_zqdUHiW0AOgeEkc1PiaGQQGSNdrHIKmUm4apg",
  },
};

export default function LocaleLayout({ children, params }) {
  const { locale } = use(params);

  return (
    <html lang={locale}>
      <body>
        <AppProviders locale={locale}>
          <LayoutShell>{children}</LayoutShell>
        </AppProviders>
      </body>
    </html>
  );
}
