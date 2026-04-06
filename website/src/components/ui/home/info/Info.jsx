"use client";
import LocaleLink from "@/components/shared/locale-link/LocaleLink";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import { useI18n } from "@/locales/client";

import ImgSkeleton from "@/components/shared/img-skeleton/ImgSkeleton";
import Loader from "@/components/shared/loader/Loader";

import styles from "./info.module.css";
import "swiper/css/pagination";

const Info = ({ details = [], loading, error }) => {
  const t = useI18n();

  return (
    <section className={styles.info}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader color="primary" size="medium" />
        </div>
      ) : error ? (
        <div className={styles.loaderContainer}>{error}</div>
      ) : (
        <Swiper
          className={styles.sliderWrapper}
          modules={[Pagination,Autoplay]}
          spaceBetween={20}
          pagination={{
            clickable: true,
            bulletActiveClass: styles.active,
            renderBullet: (index, className) => {
              return `<div class="${className} ${styles.bullet}">
          <div class="${styles.inner}"></div>
        </div>`;
            },
          }}
        >
          {details?.map((detail, index) => {
            if (detail?.active) {
              const detailHeaderItems = detail?.header?.split(" ");
              return (
                <SwiperSlide>
                  <div className={styles.infoContainer} key={index}>
                    <div className={styles.infoLeft}>
                      <h1 className={styles.infoTitle}>
                        <span className={styles.infoTitleItem}>
                          {detailHeaderItems.slice(0, 2).join(" ")}
                        </span>
                        &nbsp;
                        <span className={styles.infoTitleItem}>
                          {detailHeaderItems
                            .slice(2, detailHeaderItems.length)
                            .join(" ")}
                        </span>
                      </h1>
                      <h2 className={styles.infoLeftTitle}>{detail?.title}</h2>
                      <p className={styles.infoLeftDescription}>
                        {detail?.description}
                      </p>
                      <LocaleLink
                        href={detail?.url}
                        className={styles.infoLeftButton}
                      >
                        <div>{t("learnMore")}</div>
                        <Image
                          src="/icons/arrow-right-2.svg"
                          width={14}
                          height={14}
                          alt="Arrow"
                        />
                      </LocaleLink>
                    </div>
                    <div className={styles.infoRight}>
                      <ImgSkeleton
                        keyName="picture"
                        obj={detail}
                        defaultClass="homeTitle"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            }
          })}
        </Swiper>
      )}
    </section>
  );
};

export default Info;
