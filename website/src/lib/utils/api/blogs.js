import { blogAxios } from "@/lib/axios";

export const getBlogs = async ({ page = 0, size = 10, params } = {}) => {
  try {
    const res = await blogAxios.get(`/v1/blogs/search/admins`, {
      params: {
        page,
        size,
        ...params,
      },
    });

    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to fetch blogs");
  }
};

export const getBlogById = async (id) => {
  try {
    const res = await blogAxios.get(`/v1/blogs/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to fetch blog");
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const res = await blogAxios.get(`/v1/blogs/slug/${slug}`);
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to fetch blog");
  }
};
