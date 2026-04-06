import { eventAxios } from "@/lib/axios";

export const getEvents = async ({ page, size }) => {
  try {
    const res = await eventAxios.get(`/v1/events/search`, {
      params: {
        page,
        size,
        status: "UPCOMING",
      },
    });

    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
