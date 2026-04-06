"use client";
import Link from "next/link";
import { useCurrentLocale } from "@/locales/client";
import { useMemo } from "react";

/**
 * Locale-aware Link component that automatically prefixes URLs with the current locale.
 * This prevents 307 redirects when navigating between pages.
 * 
 * Usage:
 * <LocaleLink href="/about">About</LocaleLink>
 * // Automatically becomes /en/about or /az/about based on current locale
 */
const LocaleLink = ({ href, children, ...props }) => {
  const locale = useCurrentLocale();

  // Generate the locale-prefixed href
  const localizedHref = useMemo(() => {
    // Handle object hrefs (e.g., { pathname: '/about', query: { id: 1 } })
    if (href && typeof href === "object") {
      const pathname = href.pathname || href.href || "";
      
      // If pathname already has locale, return as is
      if (pathname.startsWith(`/${locale}/`) || pathname.startsWith("/en/") || pathname.startsWith("/az/")) {
        return href;
      }

      // If pathname is external, return as is
      if (pathname.startsWith("http://") || pathname.startsWith("https://") || pathname.startsWith("mailto:") || pathname.startsWith("tel:")) {
        return href;
      }

      // Prefix pathname with locale
      if (pathname.startsWith("/")) {
        return {
          ...href,
          pathname: href.pathname ? `/${locale}${href.pathname}` : undefined,
          href: href.href ? `/${locale}${href.href}` : undefined,
        };
      }

      return href;
    }

    // Handle string hrefs
    if (typeof href !== "string") {
      return href;
    }

    // If href already starts with a locale, return as is
    if (href.startsWith(`/${locale}/`) || href.startsWith("/en/") || href.startsWith("/az/")) {
      return href;
    }

    // If href is an external URL, return as is
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return href;
    }

    // If href starts with /, prefix with locale
    if (href.startsWith("/")) {
      return `/${locale}${href}`;
    }

    // For relative paths, add locale prefix
    return `/${locale}/${href}`;
  }, [href, locale]);

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
};

export default LocaleLink;

