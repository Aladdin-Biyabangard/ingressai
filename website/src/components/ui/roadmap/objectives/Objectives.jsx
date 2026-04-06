import styles from './objectives.module.css'

const Objectives = ({ t, title, objectives }) => {
  return <section className={styles.objectives}>
    <div className={styles.objectivesTop}>{t(title)}</div>
    <div className={styles.objectivesBottom}>
    {objectives?.map((objective,index)=>(
        <div className={styles.objective} key={index}>{objective}</div>
    ))}
    </div>
  </section>;
};

export default Objectives;
