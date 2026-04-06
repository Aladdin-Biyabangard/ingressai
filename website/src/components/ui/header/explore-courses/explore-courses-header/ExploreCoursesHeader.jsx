"use client";

import { useI18n } from "@/locales/client";

import { exploreCoursesSections } from "@/lib/constants/exploreCoursesSections";

import styles from "./explore-courses-header.module.css";

const ExploreCoursesHeader = ({ selectedSection, onClick }) => {
  const t = useI18n();

  return (
    <div className={styles.exploreCoursesHeader}>
      {exploreCoursesSections.map((item) => (
        <button
          onClick={() => onClick(item)}
          key={item}
          className={`${styles.exploreCoursesSection} ${
            item === selectedSection ? styles.exploreCoursesSectionSelected : ""
          }`}
        >
          {t(item)}
        </button>
      ))}
    </div>
  );
};

export default ExploreCoursesHeader;
