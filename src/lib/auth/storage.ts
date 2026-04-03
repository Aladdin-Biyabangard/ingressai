import type { AuthUser } from "@/lib/utils/api/auth";

const ACCESS = "ingress_access_token";
const USER = "ingress_user";

export function loadStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS);
}

export function loadStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER);
  if (!raw) return null;
  try {
    const u = JSON.parse(raw) as AuthUser;
    if (typeof u?.id === "number" && typeof u.firstName === "string" && typeof u.lastName === "string") {
      return { ...u, role: Array.isArray(u.role) ? u.role : [] };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function persistSession(accessToken: string, user: AuthUser): void {
  localStorage.setItem(ACCESS, accessToken);
  localStorage.setItem(USER, JSON.stringify(user));
}

export function clearPersistedSession(): void {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(USER);
}
