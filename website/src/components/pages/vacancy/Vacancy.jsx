"use client";
import { createRef, useMemo, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

import { useI18n } from "@/locales/client";
import { getVacancyData } from "@/lib/utils/api/vacancy";
import { errorCodes, errorResponses } from "@/lib/constants/errorCodes";

import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

import {
  defaultSectionForVacancy,
  selectSectionsAsComponentForVacancy,
} from "@/lib/constants/selectSections";

import { filterValidVacancySections } from "@/lib/utils/helpers/filters/filterValidSections";

const VacancyTitle = dynamic(
  () => import("@/components/ui/vacancy/vacancy-title/VacancyTitle"),
  { ssr: false, loading: () => null }
);
const SelectSection = dynamic(
  () => import("@/components/ui/training/select-section/SelectSection"),
  { ssr: false, loading: () => null }
);

const SharedSectionRenderer = dynamic(
  () =>
    import("@/components/shared/shared-section-renderer/SharedSectionRenderer"),
  {
    ssr: false,
    loading: () => null,
  }
);
import styles from "./vacancy.module.css";

const Vacancy = ({ vacancyId }) => {
  const [vacancy, setVacancy] = useState({
    id: "",
    title: "",
    description: "",
    requirements: "",
    categoryId: "",
    category: null,
    experienceLevel: "",
    salary: "",
    deadline: null,
    company: "",
    location: "",
    status: "",
    searchKeys: [],
    metaTitle: "",
    metaDescription: "",
    icon: null,
    companyInfo: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSection, setSelectedSection] = useState(
    defaultSectionForVacancy
  );

  const t = useI18n();

  const fetchVacancy = useCallback(async () => {
    try {
      setLoading(true);
      const vacancyData = await getVacancyData(vacancyId);

      if (errorResponses[vacancyData]) {
        setError(vacancyData);
      } else {
        const data = vacancyData || {};
        setVacancy({
          ...data,
          searchKeys: Array.isArray(data.searchKeys) ? data.searchKeys : [],
          icon: data.icon || null,
        });
      }
    } catch (err) {
      setError(errorCodes.training?.maintenance || errorCodes.vacancy?.maintenance);
    } finally {
      setLoading(false);
    }
  }, [vacancyId]);

  useEffect(() => {
    if (vacancyId) {
      fetchVacancy();
    }
  }, [fetchVacancy, vacancyId]);

  const filteredSections = filterValidVacancySections(
    vacancy,
    selectSectionsAsComponentForVacancy
  );

  const sectionRefs = useMemo(() => {
    const refs = {};
    filteredSections.forEach(({ key }) => {
      refs[key] = createRef();
    });
    return refs;
  }, [filteredSections]);

  const handleSelectSection = (section) => {
    setSelectedSection(section);

    const ref = sectionRefs[section];
    if (ref?.current) {
      const offset = 80;
      const elementTop =
        ref.current.getBoundingClientRect().top + window.scrollY;
      const scrollTo = elementTop - offset;

      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <GlobalDataWrapper error={error} loading={loading}>
      <div className={styles.container}>
        <SharedSectionRenderer
          sections={filteredSections.map(({ key, component }) => {
            const commonProps = { t, title: key };

            const propsMap = {
              description: {
                description: vacancy?.description,
              },
              requirements: {
                description: vacancy?.requirements,
              },
            };

            return {
              key,
              component,
              props: {
                ...commonProps,
                ...(propsMap[key] || {}),
              },
            };
          })}
          topPanel={<VacancyTitle vacancy={vacancy} t={t} />}
          onSelectSection={setSelectedSection}
          selectedSection={selectedSection}
          sectionRefs={sectionRefs}
          leftPanel={
            <SelectSection
              t={t}
              selectedSection={selectedSection}
              onClick={handleSelectSection}
              sections={filteredSections}
            />
          }
        />
      </div>
    </GlobalDataWrapper>
  );
};

export default Vacancy;
