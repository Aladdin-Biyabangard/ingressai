"use client";
import { useI18n } from "@/locales/client";
import { useState } from "react";

import Course from "@/components/shared/course/Course";
import Loader from "@/components/shared/loader/Loader";
import CustomPagination from "@/components/shared/custom-pagination/CustomPagination";

import { getPageable } from "@/lib/utils/helpers/pagination";

import styles from "./filtered-trainings.module.css";

const FilteredTrainings = ({ trainings, loading }) => {
  const t = useI18n();
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className={styles.loader}>
        <Loader color="primary" size="medium" />
      </div>
    );
  }

  if (trainings.length === 0) {
    return <div className={styles.loader}>{t("noTrainingsFound")}</div>;
  }

  const { currentItems, totalPages } = getPageable(trainings, currentPage, 9);

  const handleChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className={styles.filteredTrainings}>
      <div className={styles.filteredTrainingsList}>
        {currentItems.map((training) => (
          <div key={training.id} className={styles.training}>
            <Course
              levelPosition="top"
              imgHeight="200px"
              imgWidth="100%"
              duration={true}
              direction="column"
              course={training}
              lines={3}
            />
          </div>
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

export default FilteredTrainings;
