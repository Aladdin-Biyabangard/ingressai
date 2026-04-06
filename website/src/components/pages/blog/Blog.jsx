'use client'
import { useEffect, useState } from "react";
import BlogContainer from "@/components/ui/blog/blog-container/BlogContainer";
import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";
import { getBlogBySlug } from "@/lib/utils/api/blogs";

// Helper function to transform API blog to component format
const transformBlog = (apiBlog) => {
  if (!apiBlog) return null;
  
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

const BlogDetail = ({ slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogBySlug(slug);
        setBlog(transformBlog(data));
      } catch (err) {
        console.error("Failed to load blog:", err);
        setError(err.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlog();
    }
  }, [slug]);

  return (
    <GlobalDataWrapper loading={loading} error={error || (!blog && !loading ? "Blog not found" : null)}>
      {blog && <BlogContainer blog={blog} />}
    </GlobalDataWrapper>
  );
};

export default BlogDetail;
