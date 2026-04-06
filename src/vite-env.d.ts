/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_LANG?: string;
  /** Auth, chat və kurs/kateqoriya xaricindəki API-lər üçün tək backend baza URL. */
  readonly VITE_BASE_URL?: string;
  /** Kurs və kateqoriya sorğuları (course-ms). */
  readonly VITE_COURSE_MS_URL?: string;
  /**
   * İstəyə bağlı: DEV-də `VITE_BASE_URL` boş olanda bu ünvan (defolt boşdursa `http://localhost:9190/api`).
   */
  readonly VITE_LOCAL_GATEWAY_URL?: string;
  /** When "true", use GET {lang}/v1/categories/search (local); otherwise GET {lang}/v1/categories (prod). */
  readonly VITE_COURSE_CATEGORIES_USE_SEARCH?: string;
  readonly VITE_COURSE_SEARCH_PAGE?: string;
  readonly VITE_COURSE_SEARCH_SIZE?: string;
  readonly VITE_COURSE_SEARCH_SORT?: string;
  readonly VITE_CATEGORY_SEARCH_PAGE?: string;
  readonly VITE_CATEGORY_SEARCH_SIZE?: string;
  readonly VITE_COURSE_CATEGORIES_PATH?: string;
  readonly VITE_COURSE_COURSES_PATH?: string;
  /** Comma-separated extra role names (case-insensitive) that may access admin/referral routes (in addition to admin & director). */
  readonly VITE_ADMIN_ROLES?: string;
  /**
   * Invite links point here instead of the current tab origin (e.g. separate auth/marketing host).
   * Example: `https://learn.example.com`
   */
  readonly VITE_SIGNUP_WEB_ORIGIN?: string;
  /** Path segment before locale on the sign-up site, e.g. `account` → `/account/en/register?ref=…` */
  readonly VITE_SIGNUP_WEB_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
