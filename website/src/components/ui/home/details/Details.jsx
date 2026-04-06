
import Info from "../info/Info";

import styles from "./details.module.css";

const Details = ({ details, loading, error }) => {
  return (
    <section className={styles.details}>
      <Info details={details} loading={loading} error={error} />
    </section>
  );
};

export default Details;
