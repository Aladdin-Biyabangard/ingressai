"use client";
import Image from "next/image";
import { useI18n } from "@/locales/client";

import styles from "./tech-leaders.module.css";


const TeachLeaders = () => {
  const t = useI18n();

  return (
    <section className={styles.techLeaders}>
      <div className={styles.techLeadersContainer}>
        <div className={styles.techLeadersLeft}>
          <div className={styles.techLeadersLeftTop}>
            <h1 className={styles.techLeadersLeftTopTitle}>
              {t("techLeaderTitle")}
            </h1>
            <h3 className={styles.techLeadersLeftTopSubTitle}>
              {t("techLeaderSubTitle")}
            </h3>
          </div>
          <div className={styles.techLeadersLeftBottom}>
            <p>
              {t("techLeaderP1", { strong: <b>TechLeaders of Tomorrow</b> })}
            </p>
            <p>
              {t("techLeaderP2", {
                strong: (
                  <b>
                    <i>"An ounce of experience is worth a ton of theory."</i>
                  </b>
                ),
              })}
            </p>
            <p>
              {t("techLeaderP3", { strong: <b>TechLeaders of Tomorrow</b> })}
            </p>
          </div>
        </div>
        <div className={styles.techLeadersRight}>
          <Image
            src="/images/tech-leaders-right.svg"
            fill
            loading="lazy"
            alt="Tech leaders"
          />
        </div>
      </div>
    </section>
  );
};

export default TeachLeaders;
