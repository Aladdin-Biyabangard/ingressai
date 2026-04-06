"use client";
import { useGlobalData } from "@/contexts/GlobalDataContext";

import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

import AboutUs from "@/components/ui/about/about-us/AboutUs";
import HistoryMission from "@/components/ui/about/history-mission/HistoryMission";
import Instructors from "@/components/ui/about/instructors/Instructors";
import Location from "@/components/ui/about/location/Location";


import styles from "./about.module.css";

const About = () => {
  const { data, loading, error } = useGlobalData();

  return (
    <GlobalDataWrapper loading={loading.home} error={error.home}>
      <section className={styles.about}>
        <AboutUs
          error={error.home}
          loading={loading.home}
          reasons={data?.reasons}
        />
        <HistoryMission
          reasons={data?.reasons}
          loading={loading.home}
          error={error.home}
        />
        <Instructors
          instructors={data.instructors}
          loading={loading.home}
          error={error.home}
        />
        <Location />
      </section>
    </GlobalDataWrapper>
  );
};

export default About;
