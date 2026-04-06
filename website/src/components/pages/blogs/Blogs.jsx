"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "@/locales/client";

import { useGlobalData } from "@/contexts/GlobalDataContext";
import { filterOptions } from "@/lib/constants/filterOptions";
import { getBlogs } from "@/lib/utils/api/blogs";
import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

const Filters = dynamic(
  () => import("@/components/ui/trainings/filters/Filters"),
  { ssr: false, loading: () => null }
);

const BlogList = dynamic(
  () => import("@/components/shared/blog-list/BlogList"),
  { ssr: false, loading: () => null }
);

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
    categoryId: apiBlog.categoryId,
  };
};

const Blogs = () => {
  const t = useI18n();
  const {
    data: { categories },
    loading: globalLoading,
    error: globalError,
  } = useGlobalData();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(9);

  const [filters, setFilters] = useState(
    filterOptions.filter((f) => f.key === "category")
  );

  const useUrlParams = (searchParams) => {
    return useMemo(() => {
      const params = {
        page: parseInt(searchParams.get("page") || "0", 10),
      };

      const categories = searchParams.getAll("category");

      const filterParams = {
        status: "ACTIVE",
      };
      if (categories.length > 0) {
        filterParams.categoryIds = categories;
      }
      params.filterParams = filterParams;
      params.category = categories;

      return params;
    }, [searchParams]);
  };

  const urlParams = useUrlParams(searchParams);

  const [filter, setFilter] = useState({ category: urlParams.category });

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const page = urlParams.page || 0;
        
        const data = await getBlogs({ 
          page, 
          size: pageSize,
          params: urlParams.filterParams
        });
        
        const transformedBlogs = (data?.content || []).map(transformBlog);
        setBlogs(transformedBlogs);
        setTotalPages(data?.totalPages || 0);
        setTotalElements(data?.totalElements || 0);
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to load blogs:", err);
        setError(err.message || "Failed to load blogs");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [
    urlParams.page, 
    JSON.stringify(urlParams.filterParams), 
    pageSize
  ]);

  const updateFilter = (_, value) => {
    const updatedFilter = { category: value };

    const params = new URLSearchParams();

    if (
      Array.isArray(updatedFilter.category) &&
      updatedFilter.category.length > 0
    ) {
      updatedFilter.category.forEach((val) => {
        params.append("category", val);
      });
    }

    if (currentPage !== 0) {
      params.set("page", "0");
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.push(newUrl, { scroll: false });
    setFilter(updatedFilter);
  };

  useEffect(() => {
    setFilters([
      {
        key: "category",
        options: (categories || []).map((category) => ({
          id: category.id,
          key: category.name,
        })),
      },
    ]);
  }, [categories]);

  useEffect(() => {
    setFilter({ category: urlParams.category });
  }, [urlParams.category]);

  return (
    <GlobalDataWrapper error={globalError?.home || error} loading={globalLoading?.home || loading}>
      <section className={styles.blogs}>
        <div className={styles.blogsContent}>
        <Filters
          label="allBlogs"
            loading={loading}
          activeFilter={filter}
          filters={filters}
            trainings={blogs}
          onClick={updateFilter}
        />
          <div className={styles.blogListWrapper}>
            <BlogList 
              blogs={blogs}
              totalPages={totalPages}
              currentPage={currentPage + 1}
              onPageChange={(newPage) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (newPage - 1).toString());
                router.push(`${pathname}?${params.toString()}`, { scroll: false });
              }}
              className={styles.blogGrid}
            />
          </div>
        </div>
      </section>
    </GlobalDataWrapper>
  );
};

export default Blogs;
