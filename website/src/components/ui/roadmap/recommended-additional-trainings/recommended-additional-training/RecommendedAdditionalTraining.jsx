import RoadmapBorderedLink from "@/components/ui/roadmap/bordered-link/RoadmapBorderedLink";
import RoadmapTrainingDetail from "@/components/ui/roadmap/training-detail/RoadmapTrainingDetail";

import { routes } from "@/lib/constants/routes";

import styles from "./recommended-additional-training.module.css";

const RecommendedAdditionalTraining = ({ t, training }) => {
  return (
    <div className={styles.recommendedAdditionalTraining}>
      <div className={styles.top}>
        <RoadmapTrainingDetail t={t} training={training} />
        <RoadmapBorderedLink
          text="Go to Course"
          url={`${routes.trainings}/${training?.id}`}
        />
      </div>
      <div className={styles.bottom}>{training?.description}</div>
    </div>
  );
};

export default RecommendedAdditionalTraining;
