/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_DOMAIN?: string;
  readonly VITE_DOMAIN?: string;
  readonly VITE_DEFAULT_LANG?: string;
  readonly VITE_QUIZ_MS_URL?: string;
  readonly VITE_BASE_URL?: string;
  readonly VITE_USERS_MS_URL?: string;
  readonly VITE_EVENT_MS_URL?: string;
  readonly VITE_CERTIFICATE_MS_URL?: string;
  readonly VITE_BLOG_MS_URL?: string;
  readonly VITE_CHAT_MS_URL?: string;
  /** Auth API base path (defaults to VITE_CHAT_MS_URL). Must match cookie domain for refresh. */
  readonly VITE_AUTH_MS_URL?: string;
  /** When "true", use GET {lang}/v1/categories/search (local); otherwise GET {lang}/v1/categories (prod). */
  readonly VITE_COURSE_CATEGORIES_USE_SEARCH?: string;
  readonly VITE_COURSE_SEARCH_PAGE?: string;
  readonly VITE_COURSE_SEARCH_SIZE?: string;
  readonly VITE_COURSE_SEARCH_SORT?: string;
  readonly VITE_CATEGORY_SEARCH_PAGE?: string;
  readonly VITE_CATEGORY_SEARCH_SIZE?: string;
  readonly VITE_COURSE_CATEGORIES_PATH?: string;
  readonly VITE_COURSE_COURSES_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
