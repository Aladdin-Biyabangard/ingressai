import React from "react";

import { useI18n } from "@/locales/client";

import Detail from "../../../shared/why-choose-us-detail/WhyChooseUsDetail";
import Counts from "../counts/Counts";

import styles from "./why-choose-us.module.css";

const WhyChooseUs = ({ reasons }) => {
  const t = useI18n();

  return (
    <section className={styles.whyChooseUs}>
      <h2 className={styles.whyChooseUsTitle}>{t("reasonsToChooseUs")}</h2>
      <div className={styles.whyChooseUsDetails}>
        <div className={styles.whyChooseUsDetailsLeft}>
          <div className={styles.whyChooseUsDetailsLeftBg}></div>
          <Counts countMeta={reasons?.counters} />
        </div>
        <div className={styles.whyChooseUsDetailsRight}>
          {reasons?.reasonEntities.map((item, index) => (
            <div
              style={{ marginLeft: `${index * 82}px` }}
              className={styles.whyChooseUsDetail}
              key={index}
            >
              <Detail item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
