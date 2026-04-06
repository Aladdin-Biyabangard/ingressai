"use client";
import { useI18n } from "@/locales/client";
import { useState } from "react";
import LocaleLink from "@/components/shared/locale-link/LocaleLink";
import Loader from "@/components/shared/loader/Loader";
import CustomPagination from "@/components/shared/custom-pagination/CustomPagination";
import { getPageable } from "@/lib/utils/helpers/pagination";
import { routes } from "@/lib/constants/routes";

import ImgSkeleton from "@/components/shared/img-skeleton/ImgSkeleton";
import styles from "./filtered-vacancies.module.css";

const FilteredVacancies = ({ vacancies, loading }) => {
  const t = useI18n();
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className={styles.loader}>
        <Loader color="primary" size="medium" />
      </div>
    );
  }

  if (vacancies.length === 0) {
    return <div className={styles.loader}>{t("noVacanciesFound") || "No vacancies found"}</div>;
  }

  const { currentItems, totalPages } = getPageable(vacancies, currentPage, 9);

  const handleChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    const strippedText = text.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    if (strippedText.length <= maxLength) return strippedText;
    return strippedText.substring(0, maxLength) + "...";
  };

  return (
    <section className={styles.filteredVacancies}>
      <div className={styles.filteredVacanciesList}>
        {currentItems.map((vacancy) => (
          <LocaleLink
            key={vacancy.id}
            href={`${routes.vacancies}/${vacancy.id}`}
            className={styles.vacancy}
          >
            <div className={styles.vacancyCard}>
              <div className={styles.vacancyIcon}>
                <ImgSkeleton
                  type="training"
                  obj={{ icon: vacancy.icon }}
                  keyName="icon"
                  isRounded={false}
                // style={{ width: "100%", height: "200px" }}
                />
              </div>

              <div className={styles.vacancyInfo}>
                <div className={styles.vacancyHeader}>
                  <span className={styles.vacancyCompany}>{vacancy.company}</span>
                  <span className={styles.vacancyLocation}>
                    📍 {vacancy.location}
                  </span>
                </div>

                <div className={styles.vacancyBody}>
                  <h3 className={styles.vacancyTitle}>{vacancy.title}</h3>
                  <p className={styles.vacancyDescription}>
                    <span dangerouslySetInnerHTML={{__html: truncateDescription(vacancy.description)}}></span>
                  </p>
                </div>

                <div className={styles.vacancyFooter}>
                  {vacancy.salary && (
                    <span className={`${styles.vacancyTag} ${styles.vacancySalary}`}>
                      💰 {vacancy.salary}
                    </span>
                  )}
                  <span className={styles.vacancyTag}>
                    {vacancy.experienceLevel}
                  </span>
                </div>
              </div>
            </div>
          </LocaleLink>
        ))}
      </div>

      <CustomPagination
        stackProps={{
          spacing: 2,
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
        }}
        paginationProps={{
          count: totalPages,
          page: currentPage,
          onChange: handleChange,
          color: "primary",
          variant: "outlined",
          shape: "rounded",
        }}
      />
    </section>
  );
};

export default FilteredVacancies;

