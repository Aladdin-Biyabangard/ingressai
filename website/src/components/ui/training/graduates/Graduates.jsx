"use client";
import { useRef, useEffect, useState } from "react";

import Loader from "@/components/shared/loader/Loader";
import Instructor from "@/components/shared/instructor/Instructor";

import styles from "./graduates.module.css";

const Graduates = ({ t, title, error, loading, graduates = [] }) => {

  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Ensure graduates is always an array
  const safeGraduates = Array.isArray(graduates) ? graduates : [];
  const isScrollable = safeGraduates.length > 6;

  useEffect(() => {
    if (!isScrollable || !isHovered || !scrollRef.current) return;

    const container = scrollRef.current;

    scrollInterval.current = setInterval(() => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        container.scrollTop = 0;
      } else {
        container.scrollTop += 0.5;
      }
    }, 16);

    return () => clearInterval(scrollInterval.current);
  }, [isHovered, isScrollable]);

  const firstColumn = safeGraduates.slice(0, Math.ceil(safeGraduates.length / 2));
  const secondColumn = safeGraduates.slice(Math.ceil(safeGraduates.length / 2));

  return (
    <section
      className={styles.graduates}
      style={{ justifyContent: loading ? "flex-start" : "space-between" }}
    >
      <div className={styles.graduatesLeft}>
        <h2>{t(title)}</h2>
        <p>{t("graduatesContent")}</p>
      </div>

      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader size="medium" color="primary" />
        </div>
      ) : error ? (
        <div>Failed to load graduates: {error}</div>
      ) : (
        <div
          className={styles.graduatesListWrapper}
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={styles.graduatesList}>
            <div className={styles.graduatesListFirstColumn}>
              {firstColumn.map((graduate, index) => (
                <div className={styles.graduate} key={index}>
                  <Instructor instructor={graduate} />
                </div>
              ))}
            </div>
            <div className={styles.graduatesListSecondColumn}>
              {secondColumn.map((graduate, index) => (
                <div className={styles.graduate} key={index}>
                  <Instructor instructor={graduate} />
                </div>
              ))}
            </div>
            <div className={styles.graduatesAllList}>
              {safeGraduates.map((graduate, index) => (
                <div className={styles.graduate} key={index}>
                  <Instructor instructor={graduate} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Graduates;
