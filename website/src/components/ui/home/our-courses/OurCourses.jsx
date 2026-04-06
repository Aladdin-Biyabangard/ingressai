"use client";
import { useI18n } from "@/locales/client";

import { COURSE_STYLES } from "@/lib/constants/course-styles";
import { COURSE_SLIDER_STYLES } from "@/lib/constants/course-slider-styles";

import ExploreFullCatalog from "@/components/shared/explore-full-catalog/ExploreFullCatalog";
import CourseTypes from "./course-types/CourseTypes";
import CategoriesSlider from "./categories-slider/CategoriesSlider";
import CourseSlider from "@/components/shared/course-slider/CourseSlider";

import styles from "./our-courses.module.css";

const OurCourses = ({
  courses,
  loading,
  error,
  onChangeFilter,
  categories,
  categoriesError,
  categoriesLoading,
  filter,
}) => {
  const t = useI18n();

  return (
    <section className={styles.ourCourses}>
      <div className={styles.ourCoursesContainer}>
        <div className={styles.ourCoursesTop}>
          <h2 className={styles.ourCoursesTitle}>{t("ourCoursesTitle")}</h2>
          <div className={styles.ourCoursesDescription}>
            {t("ourCoursesDescription")}
          </div>
        </div>
        <CourseTypes
          t={t}
          selectedType={filter.type}
          onClick={onChangeFilter}
        />
        <CategoriesSlider
          categories={categories}
          selectedCategory={filter.category}
          onClick={onChangeFilter}
          loading={categoriesLoading}
          error={categoriesError}
        />
        <CourseSlider
          showSlider={true}
          courseStyle={COURSE_STYLES.ourCourses}
          loading={loading}
          error={error}
          courses={courses}
          sliderStyle={COURSE_SLIDER_STYLES.ourCourses}
        />

        <div className={styles.exploreFullCatalogContainer}>
          <ExploreFullCatalog t={t} url="/trainings" />
        </div>
      </div>
    </section>
  );
};

export default OurCourses;
