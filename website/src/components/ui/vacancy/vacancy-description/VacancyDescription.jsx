"use client";
import BlogTinyMCEEditor from "@/components/shared/blog-editor/BlogTinyMCEEditor";
import styles from "./vacancy-description.module.css";

const VacancyDescription = ({ t, title, description }) => {
  return (
    <section className={styles.vacancyDescription}>
      <h2 className={styles.vacancyDescriptionTitle}>{t(title)}</h2>
      <div className={styles.vacancyDescriptionContent}>
        <BlogTinyMCEEditor html={description} />
      </div>
    </section>
  );
};

export default VacancyDescription;

