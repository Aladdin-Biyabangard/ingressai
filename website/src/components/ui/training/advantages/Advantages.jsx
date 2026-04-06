import Advantage from "./advantage/Advantage";

import styles from "./advantages.module.css";

const Advantages = ({ t, title, advantages }) => {
  return (
    <section className={styles.advantages}>
      <h2 className={styles.advantagesTop}>{t(title)}</h2>
      <div className={styles.advantagesContent}>
        {advantages.map((advantage, index) => (
          <Advantage t={t} advantage={advantage} key={index} />
        ))}
      </div>
    </section>
  );
};

export default Advantages;
