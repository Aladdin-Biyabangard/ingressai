import { customAxios } from "@/lib/axios";

export const getPersonProfile = async (id) => {
  try {
    const res = await customAxios.get(`/v1/profiles/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
};
