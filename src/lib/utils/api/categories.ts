import { customAxios } from "@/lib/axios";

export type LocalizedCategory = {
  id: string | number;
  name: string;
};

function useCategoriesSearchEndpoint(): boolean {
  return import.meta.env.VITE_COURSE_CATEGORIES_USE_SEARCH === "true";
}

function extractCategoryList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.content)) return o.content;
    if (Array.isArray(o.categories)) return o.categories;
    if (Array.isArray(o.data)) return o.data;
  }
  return [];
}

function pickCategoryFields(item: unknown): LocalizedCategory | null {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;
  const id = o.id;
  if (id == null || (typeof id !== "string" && typeof id !== "number")) return null;
  const name = typeof o.name === "string" ? o.name : "";
  return { id, name };
}

export async function getLocalizedCategories(lang: string): Promise<LocalizedCategory[]> {
  try {
    const search = useCategoriesSearchEndpoint();
    const path = search ? `${lang}/v1/categories/search` : `${lang}/v1/categories`;
    const res = await customAxios.get(path, {
      params: search
        ? {
            page: Number(import.meta.env.VITE_CATEGORY_SEARCH_PAGE ?? 0),
            size: Number(import.meta.env.VITE_CATEGORY_SEARCH_SIZE ?? 100),
          }
        : {},
    });
    return extractCategoryList(res.data)
      .map(pickCategoryFields)
      .filter((c): c is LocalizedCategory => c != null);
  } catch {
    return [];
  }
}
