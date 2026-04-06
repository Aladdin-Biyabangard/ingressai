"use client";
import React, { useState } from "react";

import { useGlobalData } from "@/contexts/GlobalDataContext";

import ExploreCoursesHeader from "./explore-courses-header/ExploreCoursesHeader";
import ExploreCoursesContent from "./explore-courses-content/ExploreCoursesContent";
import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

import { exploreCoursesConfig } from "@/lib/constants/exploreCoursesSections";

import styles from "./explore-courses.module.css";

const ExploreCourses = ({ onClose }) => {
  const { loading, error } = useGlobalData();
  const [selectedSection, setSelectedSection] = useState(
    exploreCoursesConfig.defaultSection
  );

  const handleChangeSection = (item) => {
    setSelectedSection(item);
  };

  return (
    <section className={styles.exploreCoursesContainer}>
      <div className={styles.exploreCoursesBox}>
        <GlobalDataWrapper
          loading={loading.home}
          error={error.home}
          isRefreshActive={false}
        >
          <ExploreCoursesHeader
            selectedSection={selectedSection}
            onClick={handleChangeSection}
          />
          <ExploreCoursesContent onClose={onClose} isFetch={true} />
        </GlobalDataWrapper>
      </div>
    </section>
  );
};

export default ExploreCourses;
