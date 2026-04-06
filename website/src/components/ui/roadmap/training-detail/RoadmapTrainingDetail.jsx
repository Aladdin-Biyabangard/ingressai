import ImgSkeleton from "@/components/shared/img-skeleton/ImgSkeleton";

import styles from "./roadmap-training-detail.module.css";

const RoadmapTrainingDetail = ({t,training }) => {
  return (
    <div className={styles.topCourseInfo}>
      <ImgSkeleton
        keyName="icon"
        obj={training}
        defaultClass="recommendedTraining"
      />

      <div className={styles.detail}>
        <div className={styles.name}>{training?.name}</div>
        <div className={styles.other}>
          <div className={styles.type}>{t("course")}</div>
          <span className={styles.bullet}></span>
          <div className={styles.level}>{t(training?.level)}</div>
          <span className={styles.line}></span>
          <div className={styles.duration}>
            {training?.durationInWeeks} {t("weeks")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapTrainingDetail;
