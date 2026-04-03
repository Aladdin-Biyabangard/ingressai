import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { LocalizedCategory } from "@/lib/utils/api/categories";
import type { LocalizedCourse } from "@/lib/utils/api/courses";

export type GlobalCategory = LocalizedCategory;
export type GlobalCourse = LocalizedCourse;

type GlobalData = {
  categories: GlobalCategory[];
  courses: GlobalCourse[];
};

type LoadingState = {
  home: boolean;
};

const GlobalDataContext = createContext<{
  data: GlobalData;
  loading: LoadingState;
} | null>(null);

export function GlobalDataProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () =>
      ({
        data: { categories: [], courses: [] } satisfies GlobalData,
        loading: { home: false } satisfies LoadingState,
      }) as const,
    [],
  );

  return <GlobalDataContext.Provider value={value}>{children}</GlobalDataContext.Provider>;
}

export function useGlobalData() {
  const ctx = useContext(GlobalDataContext);
  if (!ctx) {
    throw new Error("useGlobalData must be used within GlobalDataProvider");
  }
  return ctx;
}
