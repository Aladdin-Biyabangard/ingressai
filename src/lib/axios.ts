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

export const quizAxios = createAxiosInstance(import.meta.env.VITE_QUIZ_MS_URL || "quiz");
export const customAxios = createAxiosInstance(import.meta.env.VITE_BASE_URL || "course-ms/api");
export const userAxios = createAxiosInstance(import.meta.env.VITE_USERS_MS_URL || "users");
export const eventAxios = createAxiosInstance(import.meta.env.VITE_EVENT_MS_URL || "event-ms/api");
export const certificateAxios = createAxiosInstance(
  import.meta.env.VITE_CERTIFICATE_MS_URL || "certificate-ms/api",
);
export const blogAxios = createAxiosInstance(import.meta.env.VITE_BLOG_MS_URL || "blog-ms");
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

let chatAuthInterceptorsInstalled = false;

export function setupChatAuthInterceptors(config: AuthInterceptorConfig): void {
  if (chatAuthInterceptorsInstalled) return;
  chatAuthInterceptorsInstalled = true;

  let refreshInFlight: Promise<string | null> | null = null;
  const refreshOnce = (): Promise<string | null> => {
    if (!refreshInFlight) {
      refreshInFlight = config.refreshAccessToken().finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  };

  chatAxios.interceptors.request.use((req) => {
    const t = config.getAccessToken();
    if (t) {
      req.headers.Authorization = `Bearer ${t}`;
    }
    return req;
  });

  chatAxios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error?.response?.status;
      const original = error?.config as { _authRetry?: boolean; headers?: Record<string, string> } | undefined;
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
      original.headers.Authorization = `Bearer ${next}`;
      return chatAxios(original);
    },
  );
}
