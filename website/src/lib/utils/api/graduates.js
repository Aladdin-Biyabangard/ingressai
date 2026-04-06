import { customAxios } from "@/lib/axios";

export const getGraduates = async (id, page, size, locale) => {
  try {
    const res = customAxios.get(
      `/${locale}/v1/courses/${id}/graduates?page=${page}&size=${size}&sort=id`
    );
    return (await res).data;
  } catch (err) {
    throw new Error(err?.message);
  }
};
