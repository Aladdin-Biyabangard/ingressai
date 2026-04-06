"use client";
import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { useI18n } from "@/locales/client";
import { useGlobalData } from "@/contexts/GlobalDataContext";

import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

const Filters = dynamic(
  () => import("@/components/ui/trainings/filters/Filters"),
  { ssr: false, loading: () => null }
);
const FilteredTrainings = dynamic(
  () =>
    import("@/components/ui/trainings/filtered-trainings/FilteredTrainings"),
  { ssr: false, loading: () => null }
);
const CourseTypes = dynamic(
  () => import("@/components/ui/home/our-courses/course-types/CourseTypes"),
  { ssr: false, loading: () => null }
);

import { filterOptions } from "@/lib/constants/filterOptions";

import styles from "./trainings.module.css";

const Trainings = () => {
  const {
    data: { courses, categories },
    loading,
    error,
  } = useGlobalData();

  const t = useI18n();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [filters, setFilters] = useState(filterOptions);

  const useUrlParams = (searchParams) => {
    return useMemo(
      () => ({
        category: searchParams.getAll("category") || [],
        type: searchParams.getAll("type") || [],
        level: searchParams.getAll("level") || [],
      }),
      [searchParams]
    );
  };

  const urlParams = useUrlParams(searchParams);

  const [filter, setFilter] = useState({
    category: urlParams.category,
    type: urlParams.type,
    level: urlParams.level,
  });

  const updateFilter = (name, value) => {
    const updatedFilter = { ...filter, [name]: value };

    const params = new URLSearchParams();

    Object.keys(updatedFilter).forEach((paramName) => {
      const paramValue = updatedFilter[paramName];

      if (Array.isArray(paramValue) && paramValue.length > 0) {
        paramValue.forEach((val) => {
          params.append(paramName, val);
        });
      }
    });

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.push(newUrl, { scroll: false });
    setFilter(updatedFilter);
  };

  useEffect(() => {
    const filteredData = courses.filter((course) => {
      const matchesCategory =
        filter.category.length === 0 ||
        filter.category.some((category) =>
          course.categories?.some((c) => c?.categoryId === category)
        );

      const matchesLevel =
        filter.level.length === 0 ||
        filter.level.includes(course.level.toLowerCase());

      const matchesType =
        filter.type.length === 0 || filter.type.includes(course.type);

      return matchesCategory && matchesLevel && matchesType;
    });

    setFilteredTrainings(filteredData);
  }, [filter.category, filter.level, filter.type, courses]);

  useEffect(() => {
    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.key === "category") {
          return {
            ...filter,
            options: categories.map((category) => ({
              id: category.id,
              key: category.name,
            })),
          };
        }
        return filter;
      })
    );
  }, [categories]);

  useEffect(() => {
    updateFilter("category", urlParams.category);
  }, [urlParams.category]);

  return (
    <GlobalDataWrapper loading={loading.home} error={error.home}>
      <section className={styles.trainings}>
        <div className={styles.courseTypes}>
          <CourseTypes
            t={t}
            selectedType={filter.type}
            onClick={updateFilter}
          />
        </div>
        <div className={styles.trainingsContent}>
          <Filters
          label="allTrainings"
            loading={loading.home}
            trainings={filteredTrainings}
            activeFilter={filter}
            filters={filters}
            onClick={updateFilter}
          />
          <FilteredTrainings
            loading={loading.home}
            trainings={filteredTrainings}
          />
        </div>
      </section>
    </GlobalDataWrapper>
  );
};

export default Trainings;
