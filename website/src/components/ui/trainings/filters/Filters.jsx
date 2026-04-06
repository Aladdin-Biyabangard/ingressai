"use client";

import { useI18n } from "@/locales/client";

import FilterGroup from "./filter-group/FilterGroup";

import styles from "./filters.module.css";

const Filters = ({
  filters,
  onClick,
  activeFilter,
  trainings = [],
  loading,
  label
}) => {
  const t = useI18n();

  return (
    <section className={styles.filters}>
      <div className={styles.filterTop}>
        <div className={styles.filterTopTitle}>{t(label)}:</div>
        <div className={styles.filterTopResults}>
          {trainings.length} {t("results")}
        </div>
      </div>
      <div className={styles.filtersList}>
        {filters.map((f, index) => (
          <FilterGroup
            loading={loading}
            onClick={onClick}
            activeFilter={activeFilter?.[f.key]}
            t={t}
            key={index}
            group={f}
          />
        ))}
      </div>
    </section>
  );
};

export default Filters;
