"use client";
import Image from "next/image";
import { useI18n } from "@/locales/client";

import styles from "./stay-updated.module.css";


const StayUpdated = () => {
  const t = useI18n();
  return (
    <section className={styles.stayUpdated}>
      <div className={styles.stayUpdatedContainer}>
        <div className={styles.stayUpdatedLeft}>
          <div className={styles.stayUpdatedIcon}>
            <Image
              src="/icons/astronaut.svg"
              height={121}
              width={117}
              alt="Astronaut"
              loading="lazy"
            />
          </div>
          <div className={styles.stayUpdatedContent}>
            <h2>{t("stayUpdatedTitle")}</h2>
            <p>{t("stayUpdatedDescription")}</p>
          </div>
        </div>
        <div className={styles.stayUpdatedRight}>
          <button>{t("getStartNow")}</button>
        </div>
      </div>
    </section>
  );
};

export default StayUpdated;
