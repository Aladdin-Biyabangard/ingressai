import React from "react";

import Box from "../Box";

import styles from "./courses.module.css";

const Courses = ({ totalCourses, loading }) => {
  return (
    <div className={styles.infoRightCourses}>
      <Box
        title="courses"
        detail={totalCourses}
        loading={loading}
        iconSrc="/icons/courses.svg"
      />
    </div>
  );
};

export default Courses;
