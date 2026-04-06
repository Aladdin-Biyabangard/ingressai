
import WhyChooseUsDetail from "@/components/shared/why-choose-us-detail/WhyChooseUsDetail";

import styles from "./history-mission.module.css";

const HistoryMission = ({reasons,loading,error}) => {
  return (
    <section className={styles.historyMission}>
      <div className={styles.historyMissionContainer}>
        {reasons?.reasonEntities?.slice(2,4).map((item, index) => (
          <div key={index} className={styles.historyMissionItem}>
            <WhyChooseUsDetail index={index} item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HistoryMission;
