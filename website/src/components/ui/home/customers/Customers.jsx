"use client";
import React, { useEffect, useState, useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid } from "swiper/modules"

import { useI18n } from "@/locales/client";

import { CUSTOMER_STYLES } from "@/lib/constants/customer-styles";

import Loader from "@/components/shared/loader/Loader";
import Customer from "./customer/Customer";
import SeeMore from "@/components/shared/see-more/SeeMore";

import styles from "./customers.module.css";;
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/grid";

const Customers = ({ customers, loading, error, title="ourCustomers" }) => {
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const t = useI18n();


  useEffect(() => {
    const calculateSlideWidth = () => {
      if (sliderRef.current) {
        setIsMobile(window.innerWidth <= 1024);
      }
    };

    calculateSlideWidth();
    window.addEventListener("resize", calculateSlideWidth);
    return () => window.removeEventListener("resize", calculateSlideWidth);
  }, []);


  return (
    <section className={styles.customers}>
      <div className={styles.customersTop}>
        <h2 className={styles.customersTopTitle}>{t(title)}</h2>
        <div
          className={`${
            !isMobile ? styles.customersBtnShown : styles.customersBtnHide
          }`}
        >
          <SeeMore url="/" />
        </div>
      </div>
      {loading ? (
        <div className={styles.customerLoaderContainer}>
          <Loader size="medium" color="primary" />
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          Failed to load customers: {error}
        </div>
      ) : (
        <Swiper
        ref={sliderRef}
          modules={[Autoplay, Grid]}
          slidesPerView={2}
          spaceBetween={20}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={4000}
          allowTouchMove={false}
          style={{ width: "100%" }}
          breakpoints={{
            0: {
              slidesPerView: 2,
              loop: false,
              grid: {
                rows: 4,
                fill: 'row'
              }
            },
            768: {
              slidesPerView: 4,
              loop: false,
              grid: {
                rows: 2,
                fill: 'row'
              }
            },
            1024: {
              slidesPerView: 8,
            },
          }}
        >
          {customers.slice(0, 12).map((customer, index) => (
            <SwiperSlide key={customer?.id || index}>
              <Customer customer={customer} style={CUSTOMER_STYLES.homePage} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div
        className={`${
          isMobile ? styles.customersBtnShown : styles.customersBtnHide
        }`}
      >
        <SeeMore url="/" />
      </div>
    </section>
  );
};

export default Customers;
