"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useI18n } from "@/locales/client";

import { COURSE_STYLES } from "@/lib/constants/course-styles";

import Loader from "@/components/shared/loader/Loader";
import MobileCourse from "@/components/shared/mobile-course/MobileCourse";

import styles from "./explore-courses-categories.module.css";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/constants/routes";

const ExploreCoursesCategories = ({
  categories,
  onClick,
  selectedCategory,
  courses = [],
  loadingCourses = false,
  errorCourses = null,
  onClose = () => {},
}) => {
  const t = useI18n();

  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileS, setIsMobileS] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsMobileS(window.innerWidth <= 576);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.exploreCoursesCategories}>
      {/* <p className={styles.exploreCoursesCategoriesTitle}>{t("subjects")}</p> */}
      <div className={styles.exploreCoursesCategoriesContent}>
        {categories.map((category) => {
          const isSelected = selectedCategory?.id === category?.id;
          {
            /* const coursesByCategory = courses[category?.key] || []; */
          }

          return (
            <div key={category?.id}>
              <div
                className={`${styles.exploreCoursesCategoriesCategory} ${
                  isSelected
                    ? styles.exploreCoursesCategoriesCategorySelected
                    : ""
                }`}
                onMouseEnter={() => {
                  if (!isMobile) {
                    onClick(category, false);
                  }
                }}
                onClick={() => {
                  if (isMobile) {
                    onClick(category, true);
                  } else {
                    router.replace(
                      `${routes.trainings}?category=${category?.id}`
                    );
                    onClose();
                  }
                }}
              >
                <div className={styles.exploreCoursesCategoriesName}>
                  {category?.name}
                </div>
                <Image
                  className={styles.exploreCoursesCategoriesArrow}
                  src={`${
                    isMobile && isSelected
                      ? "/icons/arrow-down.svg"
                      : "/icons/arrow-right.svg"
                  }`}
                  height={12}
                  width={12}
                  alt="Arrow right"
                />
              </div>

              {isMobile && isSelected && (
                <div>
                  {loadingCourses ? (
                    <div className={styles.mobileLoaderContainer}>
                      <Loader size="small" color="primary" />
                    </div>
                  ) : errorCourses ? (
                    <div>Failed to load courses: {errorCourses}</div>
                  ) : courses?.length > 0 ? (
                    <div className={styles.mobileCourseList}>
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          className={styles.mobileCourseItem}
                        >
                          <MobileCourse
                            onClose={onClose}
                            course={course}
                            direction="row"
                            lines={2}
                            courseStyle={
                              isMobileS
                                ? COURSE_STYLES.exploreCoursesMobileS
                                : COURSE_STYLES.exploreCoursesMobile
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>{t("noTrainingsFound")}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreCoursesCategories;
