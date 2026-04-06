"use client";
import Image from "next/image";
import { useState } from "react";

import Container from "../container/Container";
import RoadmapItem from "./item/RoadmapItem";

import styles from "./training-roadmap.module.css";

const TrainingRoadmap = ({ t, title, roadmap }) => {
  const [expandedIndexes, setExpandedIndexes] = useState([0]);

  const handleToggle = (index) => {
    setExpandedIndexes((prev) => {
      let indexes = prev;
      if (prev.includes(index)) {
        indexes = indexes.filter((i) => i !== index);
      } else {
        indexes = [...indexes, index];
      }
      return indexes;
    });
  };

  return (
    <section className={styles.trainingRoadmap}>
      <div className={styles.title}>{t(title)}</div>
      <div className={styles.content}>
        {roadmap?.map((item, index) => {
          const isExpanded = expandedIndexes.includes(index);

          return (
            <div
              key={item?.id}
              className={`${styles.item} ${isExpanded ? styles.expanded : ""}`}
            >
              <div className={styles.itemLeft}>
                <div className={styles.index}>{index + 1}</div>
                <div className={styles.bullets}>
                  <Image
                    className={styles.img}
                    src="/icons/bullets.png"
                    alt="bullets"
                    fill
                  />
                </div>
              </div>

              <Container isExtendable={isExpanded}>
                <RoadmapItem
                  item={item}
                  onClick={() => handleToggle(index)}
                  isExpanded={isExpanded}
                />
              </Container>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrainingRoadmap;
