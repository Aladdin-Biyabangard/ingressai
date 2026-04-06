"use client";
import { useI18n } from "@/locales/client";

import SeeMore from "../see-more/SeeMore";

import { routes } from "@/lib/constants/routes";

import styles from "./instructors-content.module.css";

const InstructorsContent = ({ showBtn = false, isFlex = false }) => {
  const t = useI18n();

  const className = isFlex ? styles.instructorsContentFlex : styles.instructorsContentBlock;

  return (
    <div className={`${styles.instructorsContent} ${className}`}>
      <div className={styles.instructorsContentTitle}>
        <h2>{t("energeticInstructorsWith")}</h2>
        <h2 className={styles.instructorsContentTitleColored}>
          {t("realWorldExperience")}
        </h2>
      </div>
      <p className={styles.instructorsContentParagraph}>
        {t("instructorsSectionParagraph")}
      </p>
      {showBtn && <SeeMore url={routes.instructors} />}
    </div>
  );
};

export default InstructorsContent;
