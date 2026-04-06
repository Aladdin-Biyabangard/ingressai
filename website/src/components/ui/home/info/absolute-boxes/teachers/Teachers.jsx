import React from "react";

import Box from "../Box";

import styles from "./teachers.module.css";

const Teachers = ({ totalInstructors, loading }) => {
  return (
    <div className={styles.infoRightTeachers}>
      <Box
        title="qualifiedTeachers"
        detail={totalInstructors}
        loading={loading}
        iconSrc="/icons/qualified-teachers.svg"
      />
    </div>
  );
};

export default Teachers;
