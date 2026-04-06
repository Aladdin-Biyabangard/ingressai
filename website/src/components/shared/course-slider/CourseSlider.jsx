"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import Loader from "../loader/Loader";
import Course from "../course/Course";

import "swiper/css";
import "swiper/css/pagination";
import styles from "./course-slide.module.css";

const CourseSlider = ({
  loading,
  error,
  courses,
  courseStyle,
  sliderStyle,
  showSlider,
}) => {
  // Ensure courses is always an array
  const safeCourses = Array.isArray(courses) ? courses : [];
  
  return loading ? (
    <div className={styles.ourCoursesLoaderContainer}>
      <Loader size="medium" color="primary" />
    </div>
  ) : error ? (
    <div className={styles.errorMessage}>
      Failed to load categories: {error}
    </div>
  ) : safeCourses.length > sliderStyle?.slidesPerView && showSlider ? (
    <div className={styles.swiperContainer}>
      <div className={`${styles.customNav} ${styles.customPrev}`}>
        <FaArrowLeft color="#FFFFFF" size={14} />
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView="auto"
        navigation={{
          prevEl: `.${styles.customPrev}`,
          nextEl: `.${styles.customNext}`,
        }}
        watchOverflow={true}
        style={{
          padding: "20px 0",
          margin: "-20px 0",
          marginRight: "-15px",
        }}
        // breakpoints={sliderStyle?.breakpoints}
        className={styles.swiper}
        wrapperClass={styles.swiperWrapper}
      >
        {safeCourses.map((course) => (
          <SwiperSlide key={course?.id} className={styles.slide}>
            <Course
              duration={true}
              lines={3}
              levelPosition="top"
              direction="column"
              course={course}
              courseStyle={courseStyle}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={`${styles.customNav} ${styles.customNext}`}>
        <FaArrowRight color="#FFFFFF" size={14} />
      </div>
    </div>
  ) : (
    <div
      className={`${styles.ourCoursesList} ${styles?.[sliderStyle?.className]}`}
    >
      {safeCourses.map((course) => (
        <div key={course?.id} className={styles.slide}>
          <Course
            duration={true}
            lines={3}
            levelPosition="top"
            direction="column"
            course={course}
            courseStyle={courseStyle}
          />
        </div>
      ))}
    </div>
  );
};

export default CourseSlider;
