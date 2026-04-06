import LocaleLink from "@/components/shared/locale-link/LocaleLink";

import { routes } from "@/lib/constants/routes";

import ImgSkeleton from "../../img-skeleton/ImgSkeleton";

import styles from "./blog.module.css";

const Blog = ({ blog }) => {
  return (
    <LocaleLink href={`${routes.blogs}/${blog?.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <ImgSkeleton obj={blog} keyName="image" defaultClass="blogImg" />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{blog.title}</h2>
        <p className={styles.description}>{blog.description}</p>
        <div className={styles.meta}>
          <span>By {blog.author}</span>
          <span>{blog.date}</span>
        </div>
      </div>
    </LocaleLink>
  );
};

export default Blog;
