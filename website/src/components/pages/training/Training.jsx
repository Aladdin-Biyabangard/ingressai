"use client";
import { createRef, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { useI18n } from "@/locales/client";

import { useTraining } from "@/contexts/TrainingContext.jsx";

import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

import {
  defaultSectionForTraining,
  selectSectionsAsComponentForTraining,
} from "@/lib/constants/selectSections";

import { filterValidSections } from "@/lib/utils/helpers/filters/filterValidSections";

const TrainingTitle = dynamic(
  () => import("@/components/ui/training/training-title/TrainingTitle"),
  { ssr: false, loading: () => null }
);
const SelectSection = dynamic(
  () => import("@/components/ui/training/select-section/SelectSection"),
  { ssr: false, loading: () => null }
);
const NextGroup = dynamic(
  () => import("@/components/shared/next-group/NextGroup"),
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
import styles from "./training.module.css";

const Training = () => {
  const { training, loading, error } = useTraining();

  const [isDownloadingSyllabus, setIsDownloadingSyllabus] = useState(false);

  const [selectedSection, setSelectedSection] = useState(
    defaultSectionForTraining
  );  

  const t = useI18n();

  const filteredSections = filterValidSections(
    training,
    selectSectionsAsComponentForTraining
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

  const handleDownloadSyllabus = (source = "default") => {
    if (
      training?.syllabus.length > 0 &&
      training?.syllabusUrl &&
      !isDownloadingSyllabus
    ) {
      if (source === "upcomingGroup") {
        setIsDownloadingSyllabus(true);
      }

      const downloadLink = document.createElement("a");
      downloadLink.href = training?.syllabusUrl;
      downloadLink.download = training?.name || "course-syllabus";

      downloadLink.addEventListener("abort", () =>
        setIsDownloadingSyllabus(false)
      );

      if (source === "upcomingGroup") {
        setTimeout(() => {
          setIsDownloadingSyllabus(false);
        }, 2000);
      }

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      console.error("Syllabus or drive link not available");
    }
  };

  const handleApply = () => {
    handleSelectSection("trainingApplicationForm");
  };

  return (
    <GlobalDataWrapper error={error} loading={loading}>
      <div className={styles.container}>
        <SharedSectionRenderer
          sections={filteredSections.map(({ key, component }) => {
            const commonProps = { t, title: key };

            const propsMap = {
              advantages: {
                advantages: training?.advantages,
              },
              trainingProgram: {
                trainingProgram: {
                  name: training?.name,
                  lessons: training?.syllabus,
                },
                loading,
                error,
              },
              upcomingGroups: {
                onClickApply: handleApply,
                upcomingGroups: training?.upcomingSessions,
              },
              graduates: {
                graduates: training?.graduates,
                loading,
                error,
              },
              companies: {
                title: "graduatesTitle",
                subTitle: "graduatesDescription",
                companies: training?.graduatesWorkplaces,
                loading,
                error,
              },
              instructors: {
                instructors: training?.instructors,
                loading,
                error,
              },
              trainingApplicationForm: {
                courseId: training?.id,
                formContinue: true,
              },
              relatedCourses: {
                showSlider: true,
                relatedCourses: Array.isArray(training?.relatedCourses) ? training.relatedCourses : [],
                loading,
                error,
              },
              faq: {
                faqData: training?.faq,
              },
              prerequisites: {
                arr: training?.prerequisites,
              },
              trainingObjectives: {
                arr: training?.objectives,
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
          topPanel={<TrainingTitle training={training} t={t} />}
          onSelectSection={setSelectedSection}
          selectedSection={selectedSection}
          sectionRefs={sectionRefs}
          leftPanel={
            <>
              <SelectSection
                t={t}
                selectedSection={selectedSection}
                onClick={handleSelectSection}
                sections={filteredSections}
              />
              <NextGroup
                training={training}
                url={training?.syllabusUrl}
                nextGroup={training?.upcomingSessions?.[0]}
                isDownloadingSyllabus={isDownloadingSyllabus}
                t={t}
                onClickSyllabus={handleDownloadSyllabus}
                onClickApply={handleApply}
              />
            </>
          }
        />
      </div>
    </GlobalDataWrapper>
  );
};

export default Training;
