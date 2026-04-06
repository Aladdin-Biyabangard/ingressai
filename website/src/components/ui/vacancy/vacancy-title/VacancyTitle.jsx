import ImgSkeleton from "@/components/shared/img-skeleton/ImgSkeleton";

import styles from "./vacancy-title.module.css";

const VacancyTitle = ({ vacancy, t }) => {
  return (
    <section className={styles.vacancyTitle}>
      <div className={styles.vacancyTitleContainer}>
        <div className={styles.vacancyTitleLeft}>
          {vacancy?.title && <h1>{vacancy.title}</h1>}
          {vacancy?.company && (
            <div className={styles.vacancyCompany}>{vacancy.company}</div>
          )}
          {vacancy?.companyInfo && (
            <div
              className={styles.vacancyCompanyInfo}
              dangerouslySetInnerHTML={{ __html: vacancy.companyInfo }}
            />
          )}
          {vacancy?.location && (
            <div className={styles.vacancyLocation}>📍 {vacancy.location}</div>
          )}

          <div className={styles.vacancyInfoBox}>
            {vacancy?.experienceLevel && (
              <div className={styles.vacancyInfoItem}>
                <span className={styles.infoLabel}>{t("level")}:</span>
                <span className={styles.infoValue}>{vacancy.experienceLevel}</span>
              </div>
            )}
            {vacancy?.salary && (
              <div className={styles.vacancyInfoItem}>
                <span className={styles.infoLabel}>{t("salary")}:</span>
                <span className={styles.infoValue}>{vacancy.salary}</span>
              </div>
            )}
            {vacancy?.deadline && (
              <div className={styles.vacancyInfoItem}>
                <span className={styles.infoLabel}>{t("deadline")}:</span>
                <span className={styles.infoValue}>
                  {new Date(vacancy.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.vacancyTitleRight}>

          <ImgSkeleton
            obj={{ icon: vacancy?.icon }}
            keyName="icon"
            isRounded={false}
            borderRadius="8px"
          />

        </div>
      </div>
    </section>
  );
};

export default VacancyTitle;

