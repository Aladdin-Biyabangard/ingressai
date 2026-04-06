"use client";
import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { useI18n } from "@/locales/client";
import { useGlobalData } from "@/contexts/GlobalDataContext";
import { getVacancies } from "@/lib/utils/api/vacancy";

import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

const Filters = dynamic(
  () => import("@/components/ui/trainings/filters/Filters"),
  { ssr: false, loading: () => null }
);
const FilteredVacancies = dynamic(
  () => import("@/components/ui/vacancies/filtered-vacancies/FilteredVacancies"),
  { ssr: false, loading: () => null }
);

import { vacancyFilterOptions } from "@/lib/constants/vacancyFilterOptions";

import styles from "./vacancies.module.css";

const Vacancies = () => {
  const {
    data: { categories },
    loading: globalLoading,
  } = useGlobalData();

  const t = useI18n();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [filters, setFilters] = useState(vacancyFilterOptions);

  const useUrlParams = (searchParams) => {
    return useMemo(
      () => ({
        category: searchParams.getAll("category") || [],
        level: searchParams.getAll("level") || [],
        salary: searchParams.getAll("salary") || [],
        workType: searchParams.getAll("workType") || [],
      }),
      [searchParams]
    );
  };

  const urlParams = useUrlParams(searchParams);

  const [filter, setFilter] = useState({
    category: urlParams.category,
    level: urlParams.level,
    salary: urlParams.salary,
    workType: urlParams.workType,
  });

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);
        const data = await getVacancies(0, 9);
        const activeVacancies = (data?.content || []).filter(
          (vacancy) => vacancy.status === "ACTIVE"
        );
        setVacancies(activeVacancies);
      } catch (err) {
        console.error("Failed to fetch vacancies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

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
    const filteredData = vacancies.filter((vacancy) => {
      const matchesCategory =
        filter.category.length === 0 ||
        filter.category.some((categoryId) =>
          vacancy.categoryId === categoryId
        );

      const matchesLevel =
        filter.level.length === 0 ||
        filter.level.includes(vacancy.experienceLevel);

      const matchesSalary = (() => {
        if (filter.salary.length === 0) return true;
        if (!vacancy.salary) return false;

        const salaryStr = vacancy.salary.toLowerCase();
        const salaryNum = parseFloat(salaryStr.replace(/[^0-9.]/g, ""));

        return filter.salary.some((range) => {
          switch (range) {
            case "under1000":
              return salaryNum < 1000;
            case "1000-2000":
              return salaryNum >= 1000 && salaryNum < 2000;
            case "2000-3000":
              return salaryNum >= 2000 && salaryNum < 3000;
            case "3000-5000":
              return salaryNum >= 3000 && salaryNum < 5000;
            case "over5000":
              return salaryNum >= 5000;
            default:
              return false;
          }
        });
      })();

      const matchesWorkType = (() => {
        if (filter.workType.length === 0) return true;
        const locationLower = (vacancy.location || "").toLowerCase();
        const isRemote = locationLower.includes("remote") || 
                        locationLower.includes("online") ||
                        vacancy.location === "Remote";

        return filter.workType.some((type) => {
          if (type === "online") return isRemote;
          if (type === "offline") return !isRemote;
          return false;
        });
      })();

      return matchesCategory && matchesLevel && matchesSalary && matchesWorkType;
    });

    setFilteredVacancies(filteredData);
  }, [filter.category, filter.level, filter.salary, filter.workType, vacancies]);

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

  const isLoading = loading || globalLoading.home;

  return (
    <GlobalDataWrapper loading={isLoading} error={null}>
      <section className={styles.vacancies}>
        <div className={styles.vacanciesContent}>
          <Filters
            label="allVacancies"
            loading={isLoading}
            trainings={filteredVacancies}
            activeFilter={filter}
            filters={filters}
            onClick={updateFilter}
          />
          <FilteredVacancies
            loading={isLoading}
            vacancies={filteredVacancies}
          />
        </div>
      </section>
    </GlobalDataWrapper>
  );
};

export default Vacancies;
