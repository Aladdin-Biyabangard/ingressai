"use client";
import Image from "next/image";

import { useI18n } from "@/locales/client";

import RoadmapTrainingDetail from "../../training-detail/RoadmapTrainingDetail";
import RoadmapBorderedLink from "../../bordered-link/RoadmapBorderedLink";

import { routes } from "@/lib/constants/routes";

import styles from "./roadmap-item.module.css";

const RoadmapItem = ({ item, onClick, isExpanded }) => {
  const t = useI18n();
  return (
    <div className={styles.item}>
      <div className={styles.top}>
        <RoadmapTrainingDetail t={t} training={item} />
        <Image
          onClick={onClick}
          className={styles.icon}
          src={
            isExpanded
              ? "/icons/syllabus-collapse.svg"
              : "/icons/syllabus-expand.svg"
          }
          width={30}
          height={30}
          alt="arrow
          "
        />
      </div>
      <div
        className={`${isExpanded ? styles.expanded : ""} ${styles.container}`}
      >
        <div className={styles.description}>{item?.description}</div>
        <RoadmapBorderedLink
          text="Go to Course"
          url={`${routes.trainings}/${item?.id}`}
        />
      </div>
    </div>
  );
};

export default RoadmapItem;
