import { courseTypes } from "@/lib/constants/courseTypes";

import styles from "./course-types.module.css";

const CourseTypes = ({ t, selectedType = "", onClick }) => {
  const handleChangeType = (type) => {
    if (Array.isArray(selectedType)) {
      let updatedType;

      if (selectedType.includes(type.key)) {
        updatedType = selectedType.filter((item) => item !== type.key);
      } else {
        updatedType = [...selectedType, type.key];
      }
      onClick("type", updatedType);
    } else {
      onClick("type", type.key);
    }
  };

  return (
    <div className={styles.courseTypes}>
      {courseTypes.slice(0, 8).map((type, index) => (
        <div
          onClick={() => handleChangeType(type)}
          className={`${styles.courseType} ${
            selectedType === type.key || selectedType?.includes(type.key)
              ? styles.courseTypeSelected
              : ""
          }`}
          key={index}
        >
          {t(type.key)}
        </div>
      ))}
    </div>
  );
};

export default CourseTypes;
