import NextGroup from "./next-group/NextGroup";

import styles from "./next-groups.module.css";

const NextGroups = ({ t, title, onClickApply, upcomingGroups }) => {
  // Ensure upcomingGroups is an array
  const safeUpcomingGroups = Array.isArray(upcomingGroups) ? upcomingGroups : [];
  
  return (
    <section className={styles.nextGroups}>
      <h2 className={styles.nextGroupsTitle}>{t(title)}</h2>
      <div className={styles.nextGroupsContent}>
        {safeUpcomingGroups.map((group, index) => (
          <NextGroup t={t} key={index} group={group} onClick={onClickApply} />
        ))}
      </div>
    </section>
  );
};

export default NextGroups;
