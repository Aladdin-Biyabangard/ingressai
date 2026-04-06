"use client";
import dynamic from "next/dynamic";

import { useGlobalData } from "@/contexts/GlobalDataContext";

import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

const CourseApplicationForm = dynamic(
  () =>
    import("@/components/shared/course-application-form/CourseApplicationForm"),
  {
    ssr: false,
    loading: () => null,
  }
);
import styles from "./course-application.module.css";

const CourseApplication = ({ params = {} }) => {
  const { data, loading, error } = useGlobalData();

  return (
    <GlobalDataWrapper loading={loading.home} error={error.home}>
      <section className={styles.courseApplication}>
        <CourseApplicationForm courses={data?.courses} params={params} />
      </section>
    </GlobalDataWrapper>
  );
};

export default CourseApplication;
