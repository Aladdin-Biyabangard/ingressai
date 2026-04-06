import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

import { siteLocales, defaultLocale } from "@/lib/constants/locales";

const I18nMiddleware = createI18nMiddleware({
  locales: siteLocales,
  defaultLocale: defaultLocale,
});

export function middleware(request: NextRequest) {
  const response = I18nMiddleware(request);

  return response;
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
