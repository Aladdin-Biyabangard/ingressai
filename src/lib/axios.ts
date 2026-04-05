import axios, { type AxiosInstance } from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN ?? "/";

function getMsUrl(servicePath: string): string {
  const trimmed = servicePath.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/+$/, "");
  }
  const baseDomain = API_DOMAIN.endsWith("/") ? API_DOMAIN.slice(0, -1) : API_DOMAIN;
  const updatedDomain =
    typeof window === "undefined"
      ? (import.meta.env.VITE_DOMAIN ?? "https://ingress.academy")
      : baseDomain;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${updatedDomain}${path}`;
}

type CreateInstanceOptions = {
  withCredentials?: boolean;
};

function createAxiosInstance(servicePath: string, options?: CreateInstanceOptions): AxiosInstance {
  const baseURL = getMsUrl(servicePath);

  const instance = axios.create({
    baseURL,
    withCredentials: options?.withCredentials ?? false,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    paramsSerializer: {
      indexes: null,
    },
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

export const customAxios = createAxiosInstance(import.meta.env.VITE_BASE_URL || "course-ms/api");
/** Course MS kökü `/api` olmadan (məs. `v1/courses/…/info`). `VITE_BASE_URL` sonundakı `/api` çıxarılır. */
const courseMsRootPath =
  (import.meta.env.VITE_BASE_URL || "course-ms/api").replace(/\/api\/?$/, "") || "course-ms";
export const courseMsAxios = createAxiosInstance(courseMsRootPath);
export const chatAxios = createAxiosInstance(import.meta.env.VITE_CHAT_MS_URL || "chat-ms/api");

/** Same service as chat by default; must use `withCredentials` for refresh cookies. */
const authServicePath =
  import.meta.env.VITE_AUTH_MS_URL ||
  import.meta.env.VITE_CHAT_MS_URL ||
  "chat-ms/api";
export const authAxios = createAxiosInstance(authServicePath, { withCredentials: true });

type AuthInterceptorConfig = {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
  onAuthFailure: () => void;
};

type BearerInterceptorOptions = {
  /** When true, do not send `Authorization` (e.g. public or cookie-only auth routes). */
  skipAuthHeader?: (requestUrl: string | undefined) => boolean;
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

/** Cookie-only or public — Spring must not require Bearer here; refresh uses `Path=/api/v1/auth` cookie + `withCredentials`. */
const AUTH_MS_SKIP_BEARER_SUBSTRINGS = [
  "v1/auth/sign-in",
  "v1/auth/sign-up",
  "v1/auth/resend-otp",
  "v1/auth/refresh",
  "v1/auth/forgot-password",
  "v1/auth/verify-otp",
  "v1/auth/reset-password",
] as const;

/** Auth MS: `sign-out` expects Bearer + roles; other `/v1/auth/*` calls stay public/cookie-only per route. */
export function setupAuthMsInterceptors(config: AuthInterceptorConfig): void {
  installBearerInterceptors(authAxios, config, authMsAuthInstalled, {
    skipAuthHeader: (url) =>
      Boolean(url && AUTH_MS_SKIP_BEARER_SUBSTRINGS.some((fragment) => url.includes(fragment))),
  });
}
