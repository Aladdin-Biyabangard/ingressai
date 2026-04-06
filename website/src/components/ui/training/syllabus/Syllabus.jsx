"use client";
import { useState } from "react";

import Loader from "@/components/shared/loader/Loader";
import Lesson from "./lesson/Lesson";

import styles from "./syllabus.module.css";

const Syllabus = ({
  trainingProgram,
  t,
  title,
  error,
  loading,
  pdfView = false,
}) => {
  const [expandAll, setExpandAll] = useState(true);

  const handleToggle = () => {
    setExpandAll((prev) => !prev);
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader size="medium" color="primary" />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load syllabus: {error}</div>;
  }

  return (
    <section
      className={`${styles.syllabus} ${
        pdfView ? styles.pdfView : styles.normalView
      }`}
    >
      <div className={styles.syllabusTop}>
        <h2 className={styles.syllabusTopLeft}>
          {trainingProgram?.name}
        </h2>
        {!pdfView && (
          <div className={styles.syllabusTopRight}>
            <button onClick={handleToggle}>
              {expandAll ? t("collapseAll") : t("expandAll")}
            </button>
          </div>
        )}
      </div>

      <div className={styles.syllabusLessons}>
        {trainingProgram?.lessons
          ?.sort((a, b) => a?.positionIndex - b?.positionIndex)
          ?.map((lesson) => (
            <Lesson
              key={lesson.id}
              lesson={lesson}
              isExpanded={expandAll}
              pdfView={pdfView}
            />
          ))}
      </div>
    </section>
  );
};

export default Syllabus;
