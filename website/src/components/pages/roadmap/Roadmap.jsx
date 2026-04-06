"use client";
import { createRef, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { useRoadmap } from "@/contexts/RoadmapContext";

import { useI18n } from "@/locales/client";

import {
  defaultSectionForRoadmap,
  selectSectionsAsComponentForRoadmap,
} from "@/lib/constants/selectSections";
import { filterValidSections } from "@/lib/utils/helpers/filters/filterValidSections";

const RoadmapTitle = dynamic(
  () => import("@/components/ui/roadmap/title/RoadmapTitle"),
  { ssr: false, loading: () => null }
);

const SelectSection = dynamic(
  () => import("@/components/ui/training/select-section/SelectSection"),
  { ssr: false, loading: () => null }
);

const SharedSectionRenderer = dynamic(
  () =>
    import("@/components/shared/shared-section-renderer/SharedSectionRenderer"),
  { ssr: false, loading: () => null }
);

import styles from "./roadmap.module.css";

const Roadmap = () => {
  const { roadmap, error, loading } = useRoadmap();

  const [selectedSection, setSelectedSection] = useState(
    defaultSectionForRoadmap
  );

  const t = useI18n();

  const filteredSections = filterValidSections(
    roadmap,
    selectSectionsAsComponentForRoadmap
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
    <div className={styles.container}>
      <SharedSectionRenderer
        sections={filteredSections.map(({ key, component }) => {
          const commonProps = { t, title: key };

          const propsMap = {
            faq: {
              faqData: roadmap?.faq,
            },
            whereDoOurGraduatesWork: {
              subTitle: "",
              companies: roadmap?.graduatesWorkplaces,
              loading,
              error,
            },
            graduatesHere: {
              instructors: roadmap?.graduates,
              error,
              loading,
            },
            rolesAndResponsibilities: {
              rolesAndResponsibilities: roadmap?.rolesAndResponsibilities,
            },
            prerequisites: {
              arr: roadmap?.prerequisites,
            },
            skillsYouWillGain: {
              objectives: roadmap?.skillsYouWillGain,
            },
            recommendedAdditionalTrainings: {
              trainings: [roadmap],
            },
            trainingRoadmap: {
              roadmap: [roadmap,{...roadmap,id:2}],
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
        sectionRefs={sectionRefs}
        onSelectSection={setSelectedSection}
        selectedSection={selectedSection}
        topPanel={
          <>
            <RoadmapTitle roadmap={roadmap} />
          </>
        }
        leftPanel={
          <>
            <SelectSection
              t={t}
              selectedSection={selectedSection}
              onClick={handleSelectSection}
              sections={filteredSections}
            />
          </>
        }
      />
    </div>
  );
};

export default Roadmap;
