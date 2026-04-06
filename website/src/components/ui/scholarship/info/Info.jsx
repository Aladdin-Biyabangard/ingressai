"use client";
import Image from "next/image";

import { useI18n } from "@/locales/client";

import styles from "./info.module.css";

const Info = () => {
  const t = useI18n();

  return (
    <section className={styles.info}>
      <div className={styles.infoLeft}>
        <Image src="/images/info-left.svg" fill alt="Info" />
      </div>
      <div className={styles.infoRight}>
        <div className={styles.container}>
          <div className={styles.textGroup}>
            <h3 className={styles.sectionTitle}>
              {t("scholarshipBenefits")}
            </h3>

            <p className={styles.benefitsText}>
              {t("scholarshipDescription")}
              <span className={styles.highlight}>100%</span>,{" "}
              <span className={styles.highlight}>70%</span>,{" "}
              <span className={styles.highlight}>50%</span>, {t("or")}{" "}
              <span className={styles.highlight}>30%</span>{" "}
              {t("tuitionWaivers")}
            </p>
          </div>

          <div className={styles.textGroup}>
            <h3 className={styles.sectionTitle}>{t("selectionProcess")}</h3>

            <div>
              <p className={styles.processDescription}>
                {t("admissionProcess")}
              </p>
              <ul className={styles.criteriaList}>
                <li>{t("universityAcceptance")}</li>
                <li>{t("englishProficiency")}</li>
                <li>
                  {t("academyTest")} ({t("finalDecisions")})
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.practicePortalCard}>
            <div className={styles.portalInfo}>
              <div className={styles.badgeIcon}>
                <Image
                  src="/icons/badge-blue.svg"
                  alt="Badge"
                  height={32}
                  width={29}
                  loading="lazy"
                />
              </div>
              <div className={styles.portalContent}>
                <h3 className={styles.portalTitle}>{t("practicePortal")}</h3>
                <p className={styles.portalDescription}>
                  {t("practicePortalDescription")}
                </p>
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <button className={styles.startButton}>{t("getStart")}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
