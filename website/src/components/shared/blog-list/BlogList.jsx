"use client";
import { useState } from "react";

import Blog from "./blog/Blog";
import CustomPagination from "@/components/shared/custom-pagination/CustomPagination";

import { getPageable } from "@/lib/utils/helpers/pagination";

import styles from "./blog-list.module.css";

const BlogList = ({
  blogs,
  isPaginationHide = false,
  totalPages: serverTotalPages,
  currentPage: serverCurrentPage,
  onPageChange,
}) => {
  const [clientCurrentPage, setClientCurrentPage] = useState(1);

  const useServerPagination = serverTotalPages !== undefined && onPageChange;
  const currentPage = useServerPagination
    ? serverCurrentPage
    : clientCurrentPage;
  const totalPages = useServerPagination ? serverTotalPages : undefined;

  if (blogs.length === 0) {
    return <div className={styles.notFound}>No blogs found.</div>;
  }

  let currentItems = blogs;
  let paginationTotalPages = totalPages;

  if (!useServerPagination) {
    const pageable = getPageable(blogs, currentPage, 6);
    currentItems = pageable.currentItems;
    paginationTotalPages = pageable.totalPages;
  }

  const handleChange = (event, value) => {
    if (useServerPagination && onPageChange) {
      onPageChange(value);
    } else {
      setClientCurrentPage(value);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div
        className={`${
          isPaginationHide ? styles.isPaginationHide : styles.blogList
        }`}
      >
        {currentItems.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
      {!isPaginationHide && (
        <CustomPagination
          stackProps={{
            spacing: 2,
            alignItems: "center",
            justifyContent: "center",
            mt: 4,
          }}
          paginationProps={{
            count: paginationTotalPages,
            page: currentPage,
            onChange: handleChange,
            color: "primary",
            variant: "outlined",
            shape: "rounded",
          }}
        />
      )}
    </div>
  );
};

export default BlogList;
