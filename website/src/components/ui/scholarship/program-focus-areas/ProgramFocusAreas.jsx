"use client";

import { useI18n } from "@/locales/client";

import CourseBoxes from "./course-boxes/CourseBoxes";
import Loader from "@/components/shared/loader/Loader";

import styles from "./program-focus-areas.module.css";

const ProgramFocusAreas = ({ loading, error, courses }) => {
  const t = useI18n();

  return (
    <section className={styles.programFocusAreas}>
      <div className={styles.programFocusAreasTop}>
        <h2>{t("programFocusAreas")}</h2>
        <p>{t("programFocusAreasSubTitle")}</p>
      </div>
      {loading ? (
        <div className={styles.programFocusAreasLoaderContainer}>
          <Loader size="medium" color="primary" />
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          Failed to load instructors: {error}
        </div>
      ) : (
        <div className={styles.programFocusAreasBottom}>
          <CourseBoxes array={courses} start={0} end={5} />
          <CourseBoxes array={courses} start={5} end={9} />
        </div>
      )}
    </section>
  );
};

export default ProgramFocusAreas;
