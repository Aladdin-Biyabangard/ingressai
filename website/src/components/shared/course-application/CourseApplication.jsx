import GetInTouch from "../get-in-touch/GetInTouch";
import CourseApplicationForm from "../course-application-form/CourseApplicationForm";

import styles from "./course-application.module.css";

const CourseApplication = ({ courses, formContinue = false }) => {
  return (
    <section className={styles.courseApplication}>
      <div className={styles.courseApplicationContainer}>
        <GetInTouch />
        <CourseApplicationForm courses={courses} formContinue={formContinue} />
      </div>
    </section>
  );
};

export default CourseApplication;
