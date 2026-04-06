import { userAxios } from "@/lib/axios";


export const verifyRecaptcha = async (data) => {
  try {
    const res = await userAxios.post("/api/v1/recaptcha/verify", data);
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
