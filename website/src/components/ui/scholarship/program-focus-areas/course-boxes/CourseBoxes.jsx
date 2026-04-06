import CourseBox from "./course-box/CourseBox";

import styles from "./course-boxes.module.css";

const CourseBoxes = ({ array, start = 0, end = array?.length }) => {
  return (
    <div className={styles.courseBoxes}>
      {array.slice(start, end).map((item, index) => (
        <CourseBox item={item} key={index} />
      ))}
    </div>
  );
};

export default CourseBoxes;
