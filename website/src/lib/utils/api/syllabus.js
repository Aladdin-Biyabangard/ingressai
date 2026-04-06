import { quizAxios } from "../../axios";

export const getSyllabus = async (id) => {
  try {
    const res = await quizAxios.get(`/v1/syllabus/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};
