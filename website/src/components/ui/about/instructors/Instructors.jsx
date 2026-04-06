"use client";
import { useEffect, useRef, useState } from "react";

import { getLimitByWidth } from "@/lib/utils/helpers";

import InstructorsContent from "@/components/shared/instructors-content/InstructorsContent";
import Loader from "@/components/shared/loader/Loader";
import Instructor from "@/components/shared/instructor/Instructor";

import styles from "./instructors.module.css";

const Instructors = ({ instructors, loading, error }) => {
  const [customInstructors, setCustomInstructors] = useState([]);
  const previousLimitRef = useRef(null);

  const updateInstructorsByWidth = (instructorList) => {
    const limit = getLimitByWidth(window.innerWidth);
    previousLimitRef.current = limit;
    setCustomInstructors(instructorList.slice(0, limit));
  };

  useEffect(() => {
    const handleResize = () => {
      const newLimit = getLimitByWidth(window.innerWidth);
      if (previousLimitRef.current !== newLimit) {
        updateInstructorsByWidth(instructors);
      }
    };

    updateInstructorsByWidth(instructors);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [instructors]);

  return (
    <section className={styles.instructors}>
      <div className={styles.instructorsContainer}>
        <div className={styles.instructorsTop}>
          <InstructorsContent showBtn={false} isFlex={true} />
        </div>
        {loading ? (
          <div className={styles.instructorsLoaderContainer}>
            <Loader size="medium" color="primary" />
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>
            Failed to load instructors: {error}
          </div>
        ) : (
          <div className={styles.instructorsBottom}>
            {customInstructors.map((instructor) => (
              <div key={instructor?.name} className={styles.instructor}>
                <Instructor instructor={instructor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Instructors;
