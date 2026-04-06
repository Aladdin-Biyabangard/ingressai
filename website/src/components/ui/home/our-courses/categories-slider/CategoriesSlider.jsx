"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import Loader from "@/components/shared/loader/Loader";

import "swiper/css";
import "swiper/css/pagination";
import styles from "./categories-slider.module.css";

const CategoriesSlider = ({
  categories,
  selectedCategory,
  onClick,
  loading,
  error,
}) => {
  return (
    <div className={styles.categories}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : error ? (
        <div className={styles.error}>Failed to load categories: {error}</div>
      ) : (
        <div className={styles.swiperContainer}>
          <div className={`${styles.customNav} ${styles.customPrev}`}>
            <FaArrowLeft color="#FFFFFF" size={14} />
          </div>
          
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView="auto"
            navigation={{
              prevEl: `.${styles.customPrev}`,
              nextEl: `.${styles.customNext}`,
            }}
            className={styles.swiper}
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id} className={styles.slide}>
                <div
                  className={`${styles.category} ${
                    selectedCategory === category.id ? styles.selectedCategory : ""
                  }`}
                  onClick={() => onClick('category',category.id)}
                >
                  <div>{category.name}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className={`${styles.customNav} ${styles.customNext}`}>
            <FaArrowRight color="#FFFFFF" size={14} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesSlider;