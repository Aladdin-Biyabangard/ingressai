import type { AuthUser } from "@/lib/utils/api/auth";

const DEFAULT_ADMIN_ROLES = new Set([
  "ADMIN",
  "ROLE_ADMIN",
  "SUPER_ADMIN",
  "ROLE_SUPER_ADMIN",
  "ADMINISTRATOR",
  "ROLE_ADMINISTRATOR",
  "DIRECTOR",
  "ROLE_DIRECTOR",
]);

function normalizeRoleList(): Set<string> {
  const extra = (import.meta.env.VITE_ADMIN_ROLES as string | undefined)?.trim();
  const set = new Set(DEFAULT_ADMIN_ROLES);
  if (extra) {
    for (const r of extra.split(",")) {
      const x = r.trim().toUpperCase();
      if (x) set.add(x);
    }
  }
  return set;
}

const adminRoleSet = normalizeRoleList();

/** True if the user may access admin-style routes (referral CMS, etc.) — admin, director, or env extras. */
export function isAdminUser(user: AuthUser | null | undefined): boolean {
  if (!user?.role?.length) return false;
  return user.role.some((r) => {
    const x = String(r).trim().toUpperCase();
    return adminRoleSet.has(x);
  });
}
