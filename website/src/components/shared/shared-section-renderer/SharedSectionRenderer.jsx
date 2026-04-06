"use client";

import { useEffect } from "react";

import styles from "./shared-section-renderer.module.css";

const SharedSectionRenderer = ({
  sections = [],
  leftPanel = null,
  topPanel = null,
  onSelectSection,
  selectedSection = "",
  sectionRefs = {},
}) => {


  useEffect(() => {
    const handleScroll = () => {
      const sectionEntries = Object.entries(sectionRefs);
      let closestSection = null;
      let minDistance = Infinity;

      sectionEntries.forEach(([key, ref]) => {
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          const distance = Math.abs(rect.top - 100);

          if (distance < minDistance && rect.top < window.innerHeight) {
            minDistance = distance;
            closestSection = key;
          }
        }
      });

      if (closestSection && closestSection !== selectedSection) {
        onSelectSection(closestSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedSection, sectionRefs, onSelectSection]);


  return (
    <section className={styles.training}>
      {topPanel}
      <div className={styles.trainingSections}>
        <div className={styles.trainingSectionsLeft}>{leftPanel}</div>
        <div className={styles.trainingSectionsRight}>
          {sections.map(({ key, component: Component, props }) => (
            <div key={key} ref={sectionRefs[key]}>
              <Component title={key} {...(props || {})} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SharedSectionRenderer;

