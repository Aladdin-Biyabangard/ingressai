
import {customAxios } from "@/lib/axios";

export const createCourseApplication = async (data) => {
  try {
    await customAxios.post(
      "/v1/course-applications",
      data
    );
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || "Failed to create application"
    );
  }
};
