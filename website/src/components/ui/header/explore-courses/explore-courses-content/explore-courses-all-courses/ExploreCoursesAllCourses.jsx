"use client";
import { useRouter } from "next/navigation";

import Course from "@/components/shared/course/Course";

import { COURSE_STYLES } from "@/lib/constants/course-styles";
import { routes } from "@/lib/constants/routes";

import styles from "./explore-courses-all-courses.module.css";


const ExploreCoursesAllCourses = ({
  onClose,
  category,
  courses,
  showEmptyMessage,
}) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.replace(`${routes.trainings}?category=${category.id}`);
    onClose();
  };

  return (
    <section className={styles.exploreAllCourses}>
      <div className={styles.exploreAllCoursesTitle}>
        <h3
          className={styles.exploreAllCoursesCategoryName}
          onClick={handleRedirect}
        >
          {category?.name}
        </h3>
        <p className={styles.exploreAllCoursesCategoryDescription}>
          {category?.description}
        </p>
      </div>
      <div className={styles.exploreAllCoursesList}>
        {courses?.length > 0 ? (
          courses.map((course) => (
            <div key={course?.id} className={styles.exploreAllCoursesItem}>
              <Course
                onClose={onClose}
                duration={false}
                lines={2}
                direction="row"
                course={course}
                key={course?.id}
                levelPosition="right"
                courseStyle={COURSE_STYLES.exploreCoursesDesktop}
              />
            </div>
          ))
        ) : showEmptyMessage ? (
          <div className={styles.exploreAllCoursesNoCourse}>
            No courses available in this category.
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ExploreCoursesAllCourses;
