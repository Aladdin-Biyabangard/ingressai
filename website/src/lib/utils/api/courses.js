import { quizAxios } from "../../axios";

export const getCourses = async (number = 0, size = 100) => {
  try {
    const res = await quizAxios.get(
      `/v1/courses/search?page=${number}&size=${size}`
    );
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const getCourse = async (key) => {
  try {
    const res = await quizAxios.get(`/v1/courses/key/${key}`);
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};
