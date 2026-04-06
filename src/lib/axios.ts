import axios, { type AxiosInstance } from "axios";

/** Trailing slash silinir; boş string build/env xətası ola bilər — dəyərlər build skriptindən gəlir. */
function trimBase(url: string | undefined): string {
  return (url ?? "").trim().replace(/\/+$/, "");
}

/**
 * Auth, chat və s. — `VITE_BASE_URL`. Lokal `vite`: boşdursa defolt `http://localhost:9190/api`.
 * `VITE_LOCAL_GATEWAY_URL` DEV-də alternativ ünvan ola bilər.
 */
function resolveAppApiBase(): string {
  const explicit = trimBase(import.meta.env.VITE_BASE_URL);
  if (explicit) return explicit;
  const override = trimBase(import.meta.env.VITE_LOCAL_GATEWAY_URL);
  if (override) return override;
  if (import.meta.env.DEV) return "http://localhost:9190/api";
  return "";
}

const courseApiBase = trimBase(import.meta.env.VITE_COURSE_MS_URL);
const courseMsRoot = courseApiBase.replace(/\/api\/?$/i, "") || courseApiBase;

const appApiBase = resolveAppApiBase();

type CreateOpts = { withCredentials?: boolean };

function createAxiosInstance(baseURL: string, options?: CreateOpts): AxiosInstance {
  const instance = axios.create({
    baseURL,
    withCredentials: options?.withCredentials ?? false,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    paramsSerializer: { indexes: null },
  });

  instance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const parts = pathname.split("/").filter(Boolean);
      const locale = parts[0];
      const supportedLocales = ["en", "az", "ru"];
      const defaultLang = import.meta.env.VITE_DEFAULT_LANG ?? "en";
      config.headers["Accept-Language"] = supportedLocales.includes(locale) ? locale : defaultLang;
    }
    return config;
  });

  return instance;
}

export const customAxios = createAxiosInstance(courseApiBase);
export const courseMsAxios = createAxiosInstance(courseMsRoot);
export const chatAxios = createAxiosInstance(appApiBase);
export const authAxios = createAxiosInstance(appApiBase, { withCredentials: true });

/** Cookie/credential auth paths — no Bearer; 401 here must not trigger refresh (avoids refresh→401 deadlock). */
const AUTH_PUBLIC_PATH_FRAGMENTS = [
  "v1/auth/sign-in",
  "v1/auth/sign-up",
  "v1/auth/resend-otp",
  "v1/auth/refresh",
  "v1/auth/forgot-password",
  "v1/auth/verify-otp",
  "v1/auth/reset-password",
  "v1/auth/validate-referral-code",
] as const;

function isAuthPublicPath(url: string | undefined): boolean {
  return Boolean(url && AUTH_PUBLIC_PATH_FRAGMENTS.some((fragment) => url.includes(fragment)));
}

type AuthInterceptorConfig = {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
  onAuthFailure: () => void;
};

type BearerInterceptorOptions = {
  skipAuthHeader?: (requestUrl: string | undefined) => boolean;
  /** When true, 401 is passed through — do not chain another refresh (critical for `v1/auth/refresh`). */
  skipRefreshRetryOn401?: (requestUrl: string | undefined) => boolean;
};

function installBearerInterceptors(
  instance: AxiosInstance,
  config: AuthInterceptorConfig,
  installedRef: { current: boolean },
  options?: BearerInterceptorOptions,
): void {
  if (installedRef.current) return;
  installedRef.current = true;

  let refreshInFlight: Promise<string | null> | null = null;
  const refreshOnce = (): Promise<string | null> => {
    if (!refreshInFlight) {
      refreshInFlight = config.refreshAccessToken().finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  };

  instance.interceptors.request.use((req) => {
    const t = config.getAccessToken();
    const skip = options?.skipAuthHeader?.(req.url);
    if (t && !skip) {
      req.headers.Authorization = `Bearer ${t}`;
    }
    return req;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error?.response?.status;
      const original = error?.config as
        | { _authRetry?: boolean; url?: string; headers?: Record<string, string> }
        | undefined;
      if (status !== 401 || !original || original._authRetry) {
        return Promise.reject(error);
      }
      if (options?.skipRefreshRetryOn401?.(original.url)) {
        return Promise.reject(error);
      }
      original._authRetry = true;
      const next = await refreshOnce();
      if (!next) {
        config.onAuthFailure();
        return Promise.reject(error);
      }
      original.headers = original.headers ?? {};
      if (options?.skipAuthHeader?.(original.url)) {
        delete original.headers.Authorization;
      } else {
        original.headers.Authorization = `Bearer ${next}`;
      }
      return instance(original);
    },
  );
}

const chatAuthInstalled = { current: false };
const authMsAuthInstalled = { current: false };

export function setupChatAuthInterceptors(config: AuthInterceptorConfig): void {
  installBearerInterceptors(chatAxios, config, chatAuthInstalled);
}

export function setupAuthMsInterceptors(config: AuthInterceptorConfig): void {
  installBearerInterceptors(authAxios, config, authMsAuthInstalled, {
    skipAuthHeader: isAuthPublicPath,
    skipRefreshRetryOn401: isAuthPublicPath,
  });
}
