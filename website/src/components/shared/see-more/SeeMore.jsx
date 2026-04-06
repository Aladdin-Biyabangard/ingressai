"use client";
import React from "react";
import LocaleLink from "../locale-link/LocaleLink";
import Image from "next/image";
import { useI18n } from "@/locales/client";

import styles from "./see-more.module.css";

const SeeMore = ({ url }) => {
  const t = useI18n();

  return (
    <LocaleLink
      href={url}
      className={styles.seeMore}
    >
      <span className={styles.seeMoreText}>
        <span className={styles.seeMoreTextInner}>{t("seeMore")}</span>
        <span className={styles.seeMoreSrOnly}>
            {t("seeMoreDescription")}
        </span>
      </span>
      <div className={styles.seeMoreIconContainer}>
        <Image
          src="/icons/arrow-top-right.svg"
          height={20}
          width={20}
          alt="Arrow"
          className={styles.seeMoreIcon}
        />
        <Image
          src="/icons/arrow-dark.svg"
          height={20}
          width={20}
          alt="Arrow Hover"
          className={styles.seeMoreIconHover}
        />
      </div>
    </LocaleLink>
  );
};

export default SeeMore;
