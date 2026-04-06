import axios from "axios";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const getMsUrl = (servicePath) => {
  const baseDomain = API_DOMAIN.endsWith("/")
    ? API_DOMAIN.slice(0, -1)
    : API_DOMAIN;

  const updatedDomain = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_DOMAIN : baseDomain

  const path = servicePath.startsWith("/") ? servicePath : `/${servicePath}`;

  return `${updatedDomain}${path}`;
};

const createAxiosInstance = (servicePath) => {
  const baseURL = getMsUrl(servicePath);

  const instance = axios.create({
    baseURL,
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
      const parts = pathname.split("/");
      const locale = parts[1];
      const supportedLocales = ["en", "az", "ru"];
      if (supportedLocales.includes(locale)) {
        config.headers["Accept-Language"] = locale;
      } else {
        config.headers["Accept-Language"] = "en";
      }
    }
    return config;
  });

  return instance;
};

export const quizAxios = createAxiosInstance(
  process.env.NEXT_PUBLIC_QUIZ_MS_URL
);

export const customAxios = createAxiosInstance(
  process.env.NEXT_PUBLIC_BASE_URL
);

export const userAxios = createAxiosInstance(
  process.env.NEXT_PUBLIC_USERS_MS_URL
);

export const eventAxios = createAxiosInstance(
  process.env.NEXT_PUBLIC_EVENT_MS_URL
);

export const certificateAxios = createAxiosInstance(
  process.env.NEXT_PUBLIC_CERTIFICATE_MS_URL
);

export const blogAxios = createAxiosInstance(
  process.env.NEXT_PUBLIC_BLOG_MS_URL
);
