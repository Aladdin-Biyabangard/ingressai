"use client";
import { useGlobalData } from "@/contexts/GlobalDataContext";

import ExploreCoursesCategories from "./explore-courses-categories/ExploreCoursesCategories";
import ExploreCoursesAllCourses from "./explore-courses-all-courses/ExploreCoursesAllCourses";
import Loader from "@/components/shared/loader/Loader";

import styles from "./explore-courses-content.module.css";



const ExploreCoursesContent = ({ onClose }) => {
  const {
    data,
    error,
    loading,
    setSelectedCategoryForExplore,
    selectedCategoryForExplore: selectedCategory,
  } = useGlobalData();

  const handleChangeCategory = (category, isMobile) => {
    if (isMobile) {
      if (selectedCategory?.id === category?.id) {
        setSelectedCategoryForExplore({});
      } else {
        setSelectedCategoryForExplore(category);
      }
    } else {
      setSelectedCategoryForExplore(category);
    }
  };

  return (
    <div className={styles.exploreCoursesContent}>
      <div className={styles.exploreCoursesCategories}>
        {loading.home ? (
          <div className={styles.loaderContainer}>
            <Loader size="medium" color="primary" />
          </div>
        ) : error.home ? (
          <div className={styles.errorMessage}>
            Failed to load categories: {error.home}
          </div>
        ) : (
          <ExploreCoursesCategories
            onClose={onClose}
            categories={data.categories}
            selectedCategory={selectedCategory}
            onClick={handleChangeCategory}
            courses={data.filteredExploreCourses}
            loadingCourses={loading.home}
            errorCourses={error.home}
          />
        )}
      </div>
      <div className={styles.exploreCoursesAllCoursesContainer}>
        {loading.home ? (
          <div className={styles.loaderContainer}>
            <Loader size="medium" color="primary" />
          </div>
        ) : error.home ? (
          <div className={styles.errorMessage}>
            Failed to load courses: {error.home}
          </div>
        ) : (
          <ExploreCoursesAllCourses
            onClose={onClose}
            courses={data.filteredExploreCourses}
            category={selectedCategory}
            showEmptyMessage={!loading.home && selectedCategory?.key}
          />
        )}
      </div>
    </div>
  );
};

export default ExploreCoursesContent;
