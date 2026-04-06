"use client";
import styles from "./blog-container.module.css";
import BlogTinyMCEEditor from '@/components/shared/blog-editor/BlogTinyMCEEditor';

const BlogContainer = ({ blog }) => {
  return (
    <section className={styles.blogDetailPage}>
    <article className={styles.blogDetail}>
      <header className={styles.header}>
        <h1 className={styles.title}>{blog.title}</h1>
          
          {blog.description && (
            <p className={styles.description}>{blog.description}</p>
          )}
          
        <div className={styles.meta}>
          <span className={styles.author}>By {blog.author}</span>
            <span className={styles.separator}>•</span>
          <span className={styles.date}>
              {typeof blog.date === 'string' 
                ? new Date(blog.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : blog.date}
            </span>
        </div>
      </header>

      <section className={styles.content}>
        <BlogTinyMCEEditor html={blog.content} />
      </section>
    </article>
    </section>
  );
};

export default BlogContainer;
