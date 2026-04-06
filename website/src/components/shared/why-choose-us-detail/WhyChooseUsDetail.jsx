'use client'
import { useI18n } from "@/locales/client";

import styles from "./why-choose-us-detail.module.css";

const WhyChooseUsDetail = ({ item, index }) => {
  const t = useI18n();

  return (
    <div
      className={styles.whyChooseUsDetailItem}
    >
      <div className={styles.whyChooseUsDetailItemAbsoluteBorder} />
      <h3 className={styles.whyChooseUsDetailItemTitle}>{t(item?.title)}</h3>
      <div className={styles.whyChooseUsDetailItemDescription}>
        {t(item?.description)}
      </div>
    </div>
  );
};

export default WhyChooseUsDetail;
