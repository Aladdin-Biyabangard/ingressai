import React from "react";

import Box from "../Box";

import { courseInfo } from "@/lib/constants/info";

import styles from "./students.module.css";

const Students = () => {
  return (
    <div className={styles.infoRightStudents}>
      <Box
        title="certifiedStudents"
        detail={courseInfo.certifiedStudents}
        iconSrc="/icons/certified-students.svg"
      />
    </div>
  );
};

export default Students;
