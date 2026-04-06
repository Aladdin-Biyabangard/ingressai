import styles from "./skills-required.module.css";

const SkillsRequired = ({ t, title, arr }) => {
  return (
    <section className={styles.skillsRequired}>
      <div className={styles.skillsRequiredTop}>{t(title)}</div>
      <ul className={styles.skillsRequiredBottom}>
        {arr?.map((item, index) => (
          <li className={styles.skill} key={index}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SkillsRequired;