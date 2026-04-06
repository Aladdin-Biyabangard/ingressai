import { customAxios } from "@/lib/axios";
import { errorCodes } from "@/lib/constants/errorCodes";

export const getHomeData = async (lang) => {
  try {
    const res = await customAxios.get(`/${lang}/v1/home`);
    return res.data;
  } catch (err) {
    return err?.status || errorCodes.certificate.maintenance;
  }
};
