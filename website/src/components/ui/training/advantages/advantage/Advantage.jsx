
import styles from "./advantage.module.css";

const Advantage = ({ t, advantage }) => {
  return (
    <div className={styles.advantage}>

    <img src={advantage.icon} alt={advantage.title}  height={48} width={48} loading="lazy" />
      <div className={styles.advantageContent}>
        <div>{t(advantage.title)}</div>
        <p>{t(advantage.description)}</p>
      </div>
    </div>
  );
};

export default Advantage;
