import ImgSkeleton from "@/components/shared/img-skeleton/ImgSkeleton";

import { COURSE_STYLES } from "@/lib/constants/course-styles";

import styles from "./roadmap-title.module.css";

const RoadmapTitle = ({ roadmap }) => {
  return (
    <section className={styles.roadmapTitle}>
      <div className={styles.roadmapTitleContainer}>
        <div className={styles.roadmapTitleLeft}>
          <h1>Java Backend Developer </h1>
          <p>
            A Java Backend Developer is a specialized software engineer who
            builds and maintains the server-side logic of web applications or
            services using Java and related technologies. Their work forms the
            invisible backbone that supports user-facing features—handling data
            processing, integrations, business logic, performance, and security.
          </p>
        </div>
        <div className={styles.roadmapTitleRight}>
          <ImgSkeleton
            style={COURSE_STYLES.roadmap}
            obj={roadmap}
            keyName="icon"
          />
        </div>
      </div>
    </section>
  );
};

export default RoadmapTitle;
