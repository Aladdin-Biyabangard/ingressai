import styles from "./roles-responsibilities.module.css";

const RolesResponsibilities = ({ t, title, rolesAndResponsibilities }) => {
  return (
    <section className={styles.roles}>
      <div className={styles.rolesTop}>{t(title)}</div>
      <div className={styles.rolesBottom}>
        {rolesAndResponsibilities?.title}
        <ul className={styles.rolesAndResponsibilitiesArray}>
          {rolesAndResponsibilities?.content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RolesResponsibilities;
