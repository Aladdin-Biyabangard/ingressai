import RecommendedAdditionalTraining from "./recommended-additional-training/RecommendedAdditionalTraining";
import Container from "@/components/ui/roadmap/container/Container";

import styles from "./recommended-additional-trainings.module.css";

const RecommendedAdditionalTrainings = ({ t, title, trainings }) => {
  return (
    <section className={styles.recommendedAdditionalTrainings}>
      <div className={styles.title}>{t(title)}</div>
      <div className={styles.description}>
        In addition to core java skills, Java developers should have solid
        background in Linux, Network and SQL. The following training sessions
        are also recommended to boost your skills. 
      </div>

      <div className={styles.content}>
        {trainings.map((training) => (
          <Container isExtendable={false} key={training?.id}>
            <RecommendedAdditionalTraining t={t} training={training} />
          </Container>
        ))}
      </div>
    </section>
  );
};

export default RecommendedAdditionalTrainings;
