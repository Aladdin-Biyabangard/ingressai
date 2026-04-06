import Loader from "@/components/shared/loader/Loader";
import Instructor from "@/components/shared/instructor/Instructor";

import styles from "./instructors.module.css";

const Instructors = ({ t, title, error, loading, instructors }) => {
  return (
    <section className={styles.instructors}>
      <h2 className={styles.instructorsTop}>{t(title)}</h2>
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader size="medium" color="primary" />
        </div>
      ) : error ? (
        <div>Failed to load instructors: {error}</div>
      ) : (
        <div className={styles.instructorsList}>
          {instructors.map((instructor, index) => (
            <div key={index} className={styles.instructor}>
              <Instructor instructor={instructor} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Instructors;
