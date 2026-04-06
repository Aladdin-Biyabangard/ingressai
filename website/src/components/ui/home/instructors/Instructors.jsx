"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";

import InstructorsContent from "@/components/shared/instructors-content/InstructorsContent";
import Loader from "@/components/shared/loader/Loader";
import Instructor from "@/components/shared/instructor/Instructor";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/grid";
import styles from "./instructors.module.css";

const Instructors = ({ instructors, loading, error }) => {
  return (
    <section className={styles.instructors}>
      <div className={styles.instructorsContainer}>
        <div className={styles.instructorsLeft}>
          <InstructorsContent showBtn={true} isFlex={false} />
        </div>
        <div className={styles.instructorsRight}>
          {loading ? (
            <Loader size="medium" color="primary" />
          ) : error ? (
            <div className={styles.errorMessage}>
              Failed to load instructors: {error}
            </div>
          ) : (
            <div className={styles.swiperWrapper}>
              <Swiper
                modules={[Pagination, Grid]}
                spaceBetween={20}
                grid={{ rows: 2, fill: "row" }}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                  },
                  577: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    grid: { rows: 1 },
                  },
                  1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    grid: { rows: 1 },
                  },
                }}
                pagination={{
                  clickable: true,
                  bulletClass: `swiper-bullet ${styles.bullet}`,
                  bulletActiveClass: styles.active,
                }}
                className={styles.swiper}
              >
                {instructors.map((instructor) => (
                  <SwiperSlide
                    key={instructor?.id}
                    style={{ height: "auto", marginBottom: "30px" }}
                  >
                    <div className={styles.instructorContainer}>
                      <Instructor instructor={instructor} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Instructors;
