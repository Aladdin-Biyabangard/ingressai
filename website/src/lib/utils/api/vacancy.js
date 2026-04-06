import { customAxios } from "@/lib/axios";
import { errorCodes } from "@/lib/constants/errorCodes";

export const getVacancies = async (number = 0, size = 100) => {
  try {
    const res = await customAxios.get(
      `/v1/vacancies/search?page=${number}&size=${size}`
    );
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const getVacancyData = async (id) => {
  try {
    const res = await customAxios.get(`/v1/vacancies/${id}`);
    return res.data;
  } catch (err) {
    return err?.status || errorCodes.certificate.maintenance;
  }
};

