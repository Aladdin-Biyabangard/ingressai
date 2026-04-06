"use client";
import Image from "next/image";

import { useI18n } from "@/locales/client";

import styles from "./about-us.module.css";

const AboutUs = ({reasons,loading,error}) => {
  const t = useI18n();
  return (
    <section className={styles.aboutUs}>
      <div className={styles.aboutUsContainer}>
        <div className={styles.aboutUsLeft}>
          <h1 className={styles.aboutUsTop}>{t("aboutUs")}</h1>
          <div className={styles.aboutUsBottom}>
            {reasons?.reasonEntities?.slice(0,2).map((item, index) => (
              <div key={index} className={styles.aboutUsContent}>
                <h2>{t(item.title)}</h2>
                <p>{t(item.description)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.aboutUsRight}>
            <Image src='/images/about-us.svg' fill alt="About us"/>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
