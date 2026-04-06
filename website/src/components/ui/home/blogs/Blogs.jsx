"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/locales/client";

import BlogList from "@/components/shared/blog-list/BlogList";
import SeeMore from "@/components/shared/see-more/SeeMore";
import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";
import { getBlogs } from "@/lib/utils/api/blogs";

import styles from "./blogs.module.css";

const transformBlog = (apiBlog) => {
  const date = new Date(apiBlog.createdAt);
  return {
    id: apiBlog.id,
    title: apiBlog.title,
    description: apiBlog.description,
    content: apiBlog.content,
    image: apiBlog.coverImageUrl || "/images/default-blog.jpg",
    author: apiBlog.author || "Ingress Academy",
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    slug: apiBlog.slug,
  };
};

const Blogs = () => {
  const t = useI18n();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogs({
          page: 0,
          size: 3,
          params: {
            status: "ACTIVE"
          }
        });

        const transformedBlogs = (data?.content || []).map(transformBlog);
        setBlogs(transformedBlogs);
      } catch (err) {
        console.error("Failed to load blogs:", err);
        setError(err.message || "Failed to load blogs");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  return (
    <GlobalDataWrapper loading={loading} error={error}>
      <section className={styles.blogsSection}>
        <div className={styles.blogsTitle}>{t("blogs")}</div>
        <BlogList blogs={blogs} isPaginationHide={true} />
        <div className={styles.seeMoreWrapper}>
          <SeeMore url="/blogs" />
        </div>
      </section>
    </GlobalDataWrapper>
  );
};

export default Blogs;
