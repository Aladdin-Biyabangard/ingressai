"use client";
import React from "react";
import Image from "next/image";

import { useI18n } from "@/locales/client";

import styles from "./practice-portal.module.css";

const PracticePortal = () => {
  const t = useI18n();

  return (
    <section className={styles.practicePortal}>
      <div className={styles.practicePortalContainer}>
        <div className={styles.practicePortalLeft}>
          <Image
            src="/images/practice-portal-1.svg"
            alt="Practice Portal"
            width={302}
            height={334}
            loading="lazy"
            className={styles.practicePortalImage}
          />
          <Image
            src="/images/practice-portal-2.svg"
            alt="Practice Portal"
            width={302}
            height={334}
            loading="lazy"
            className={styles.practicePortalImage}
          />
        </div>
        <div className={styles.practicePortalRight}>
          <div className={styles.practicePortalRightHeader}>
            <Image
              src="/icons/badge.svg"
              height={44}
              width={40}
              alt="Badge"
              loading="lazy"
            />
            <div>
              <h2 className={styles.practicePortalRightTitle}>
                {t("yourPracticePortal")}
              </h2>
              <h3 className={styles.practicePortalRightSubTitle}>
                {t("yourPracticePortalSubTitle")}
              </h3>
            </div>
          </div>
          <div className={styles.practicePortalRightContent}>
            <p className={styles.practicePortalRightContentDescription}>
              {t("yourPracticePortalDescription1")}
            </p>
            <p className={styles.practicePortalRightContentDescription}>
              {t("yourPracticePortalDescription2")}
            </p>
            <p className={styles.practicePortalRightContentDescription}>
              {t("yourPracticePortalDescription3")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticePortal;
