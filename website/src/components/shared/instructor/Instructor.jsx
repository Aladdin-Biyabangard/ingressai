import { FaLinkedin } from "react-icons/fa";

import { INSTRUCTOR_STYLES } from "@/lib/constants/instructor-styles";

import ImgSkeleton from "../img-skeleton/ImgSkeleton";

import styles from "./instructor.module.css";

const Instructor = ({ instructor }) => {
  return (
    <div className={styles.instructor}>
      <div className={styles.instructorImgContainer}>
        <ImgSkeleton
          type="instructor"
          obj={instructor}
          keyName="image"
          isRounded={true}
          style={INSTRUCTOR_STYLES.about}
        />
      </div>
      {instructor?.linkedinUrl && (
        <a href={instructor?.linkedinUrl} target="_blank">
          <FaLinkedin size={20} color="#0A66C2" />
        </a>
      )}
      <div className={styles.instructorInfo}>
        <div className={styles.instructorName}>{instructor?.name}</div>
        <div className={styles.instructorRole}>{instructor?.position}</div>
        <div className={styles.instructorCompany}>
          {instructor?.workPlace?.name}
        </div>
      </div>
    </div>
  );
};

export default Instructor;
