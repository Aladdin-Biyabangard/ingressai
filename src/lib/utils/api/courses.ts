import { customAxios } from "@/lib/axios";

export type LocalizedCourse = {
  id: string | number;
  name: string;
};

/** `GET …/{courseId}/info` — chat tarixçəsindən gələn kurs üçün. */
export type CourseShortInfoForChat = {
  id: string | number;
  name: string;
  category: {
    categoryId: string | number;
    categoryName: string;
  };
};

function parseCourseShortInfoForChat(data: unknown): CourseShortInfoForChat | null {
  if (data == null || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const id = o.id;
  if (id == null || (typeof id !== "string" && typeof id !== "number")) return null;
  const name = typeof o.name === "string" ? o.name : "";
  const catRaw = o.category;
  if (catRaw == null || typeof catRaw !== "object") return null;
  const c = catRaw as Record<string, unknown>;
  const categoryId = c.categoryId ?? c.id;
  if (categoryId == null || (typeof categoryId !== "string" && typeof categoryId !== "number")) {
    return null;
  }
  const categoryName =
    typeof c.categoryName === "string"
      ? c.categoryName
      : typeof c.name === "string"
        ? c.name
        : "";
  return {
    id,
    name,
    category: { categoryId, categoryName },
  };
}

/**
 * Kurs ID-si `-az` / `-ru` ilə bitmirsə `en` istifadə olunur.
 */
export function chatLangFromCourseId(courseId: string): "az" | "en" | "ru" {
  if (courseId.endsWith("-az")) return "az";
  if (courseId.endsWith("-ru")) return "ru";
  return "en";
}

export async function getCourseShortInfoForChat(
  courseId: string,
  lang: string,
): Promise<CourseShortInfoForChat | null> {
  const lng = lang.trim() || "en";
  try {
    const path = `${lng}/v1/courses/${encodeURIComponent(courseId)}/info`;
    const res = await customAxios.get<unknown>(path);
    return parseCourseShortInfoForChat(res.data);
  } catch {
    return null;
  }
}

function extractCourseList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.content)) return o.content;
    if (Array.isArray(o.courses)) return o.courses;
    if (Array.isArray(o.data)) return o.data;
  }
  return [];
}

function pickCourseFields(item: unknown): LocalizedCourse | null {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;
  const id = o.id;
  if (id == null || (typeof id !== "string" && typeof id !== "number")) return null;
  const name = typeof o.name === "string" ? o.name : "";
  return { id, name };
}

export async function getLocalizedCourses(lang: string): Promise<LocalizedCourse[]> {
  try {
    const path = `${lang}/v1/courses/search`;
    const res = await customAxios.get(path, {
      params: {
        page: Number(import.meta.env.VITE_COURSE_SEARCH_PAGE ?? 0),
        size: Number(import.meta.env.VITE_COURSE_SEARCH_SIZE ?? 10),
        sort: import.meta.env.VITE_COURSE_SEARCH_SORT ?? "id",
      },
    });
    return extractCourseList(res.data)
      .map(pickCourseFields)
      .filter((c): c is LocalizedCourse => c != null);
  } catch {
    return [];
  }
}
