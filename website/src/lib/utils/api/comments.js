import { customAxios } from "@/lib/axios";


export const getComments = async () => {
  try {
    const res = await customAxios.get("/v1/google/map/reviews");
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};
