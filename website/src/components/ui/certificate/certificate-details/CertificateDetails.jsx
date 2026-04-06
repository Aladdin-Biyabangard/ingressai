import styles from "./certificate-details.module.css";

const CertificateDetails = ({ certificate, t }) => {
  return (
    <section className={styles.certificateCardSection}>
      <div className={styles.certificateCard}>
        <div className={styles.cardColumn}>
          <h1 className={styles.cardTitle}>{t("certificateDetails")}</h1>
          <div className={styles.cardItem}>
            <span className={styles.cardIcon}>👤</span>
            <div>
              <div className={styles.cardLabel}>{t("certificateHolder")}</div>
              <div className={styles.cardValue}>
                {certificate?.person?.firstName} {certificate?.person?.lastName}
              </div>
              <div className={styles.cardSubValue}>
                {certificate?.person?.emailAddress}
              </div>
            </div>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.cardIcon}>📅</span>
            <div>
              <div className={styles.cardLabel}>{t("issueDate")}</div>
              <div className={styles.cardValue}>
                {new Date(certificate?.issueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.cardIcon}>🛡️</span>
            <div>
              <div className={styles.cardLabel}>{t("credentialId")}</div>
              <div className={styles.cardCredential}>
                {certificate?.credentialId}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.cardColumn}>
          <h2 className={styles.cardTitle}>{t("aboutThisCertificate")}</h2>
          <div className={styles.cardItem}>
            <span className={styles.cardIcon}>📝</span>
            <div>
              <div className={styles.cardLabel}>{t("description")}</div>
              <div className={styles.cardDescription}>
                {certificate?.description}
              </div>
            </div>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.cardIcon}>🏅</span>
            <div>
              <div className={styles.cardLabel}>{t("skillsCovered")}</div>
              <div className={styles.cardSkills}>
                {certificate?.skills?.map((skill, index) => (
                  <span key={index} className={styles.cardSkill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.cardIcon}>🏢</span>
            <div>
              <div className={styles.cardLabel}>{t("issuingOrganization")}</div>
              <div className={styles.cardValue}>
                {certificate?.issuingOrganization}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificateDetails;
