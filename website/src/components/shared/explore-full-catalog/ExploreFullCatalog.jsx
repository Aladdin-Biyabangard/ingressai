import React from "react";
import Image from "next/image";
import LocaleLink from "../locale-link/LocaleLink";

import styles from "./explore-full-catalog.module.css";

const ExploreFullCatalog = ({ url, t, title }) => {
  return (
    <LocaleLink href={url} className={styles.subjectAreasExploreFullCatalog}>
      <div className={styles.subjectAreasExploreFullCatalogContent}>
        {t("exploreFullCatalog", { key: title })}
      </div>
      <div className={styles.iconContainer}>
        <Image
          src="/icons/arrow-top-right.svg"
          height={20}
          width={20}
          alt="Arrow"
          className={styles.defaultIcon}
        />
        <Image
          src="/icons/arrow-top-right-light.svg"
          height={20}
          width={20}
          alt="Arrow Hover"
          className={styles.hoverIcon}
        />
      </div>
    </LocaleLink>
  );
};

export default ExploreFullCatalog;
