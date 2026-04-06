const BASE = process.env.NEXT_PUBLIC_API_DOMAIN;

export const API_URLS = {
  QUIZ: `${BASE}${process.env.NEXT_PUBLIC_QUIZ_MS_URL}`,
  APPLICATION: `${BASE}${process.env.NEXT_PUBLIC_APPLICATION_MS_URL}`,
  
};
