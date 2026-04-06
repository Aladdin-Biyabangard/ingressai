import { AUTH_REGISTER_SEGMENT } from "@/lib/auth/registerRoute";

/**
 * Builds the URL copied as “invite link”: opens `/{lang}/register?ref=&program=`.
 * Query params are sent with `POST v1/auth/sign-up` when the user submits the form.
 *
 * - `VITE_SIGNUP_WEB_ORIGIN`: optional absolute origin (e.g. `https://app.example.com`).
 *   If unset, uses `window.location.origin`.
 * - `VITE_SIGNUP_WEB_BASE_PATH`: optional segment before locale, e.g. `account` → `/account/{lang}/register?…`
 */
export function buildReferralInviteUrl(lang: string | undefined, ref: string, programId: string): string {
  const envOrigin = import.meta.env.VITE_SIGNUP_WEB_ORIGIN?.trim().replace(/\/+$/, "") ?? "";
  const base =
    envOrigin ||
    (typeof window !== "undefined" ? window.location.origin.replace(/\/+$/, "") : "") ||
    "";
  const pathPrefix = (import.meta.env.VITE_SIGNUP_WEB_BASE_PATH ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  const locale = (lang?.trim() || import.meta.env.VITE_DEFAULT_LANG || "en").toLowerCase();
  const pathParts = [pathPrefix, locale, AUTH_REGISTER_SEGMENT].filter(Boolean);
  const pathname = `/${pathParts.join("/")}`;
  const url = new URL(pathname, `${base}/`);
  url.searchParams.set("ref", ref);
  url.searchParams.set("program", programId);
  return url.toString();
}
