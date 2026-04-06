
import styles from "./select-section.module.css";

const SelectSection = ({ t, selectedSection, onClick,sections }) => {
  return (
    <div className={styles.selectSection}>
      {sections.map((section, index) => (
        <h3
          key={index}
          onClick={() => onClick(section.key)}
          className={`${styles.selectSectionItem} ${
            section.key === selectedSection ? styles.selectedSectionItem : ""
          }`}
        >
          {t(section.key)}
        </h3>
      ))}
    </div>
  );
};

export default SelectSection;
