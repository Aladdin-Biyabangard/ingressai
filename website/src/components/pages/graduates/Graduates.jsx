"use client";
import dynamic from "next/dynamic";

import { useGlobalData } from "@/contexts/GlobalDataContext";

import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

const GraduatesTitle = dynamic(
  () => import("@/components/ui/graduates/graduates-title/GraduatesTitle"),
  { ssr: false, loading: () => null }
);
const Customers = dynamic(
  () => import("@/components/ui/home/customers/Customers"),
  { ssr: false, loading: () => null }
);

const CourseApplication = dynamic(
  () => import("@/components/shared/course-application/CourseApplication"),
  { ssr: false, loading: () => null }
);
const Instructors = dynamic(
  () => import("@/components/ui/about/instructors/Instructors"),
  { ssr: false, loading: () => null }
);

import styles from "./graduates.module.css";


const Graduates = () => {
  const { data, error, loading } = useGlobalData();

  return (
    <GlobalDataWrapper error={error.home} loading={loading.home}>
      <section className={styles.graduates}>
        <GraduatesTitle />
        <Instructors
          instructors={data.instructors}
          loading={loading.home}
          error={error.home}
        />
        <Customers
          title="leadingCompaniesEmployingOurGraduates"
          customers={data.customers}
          loading={loading.home}
          error={error.home}
        />
        <CourseApplication formContinue={true} />
      </section>
    </GlobalDataWrapper>
  );
};

export default Graduates;
