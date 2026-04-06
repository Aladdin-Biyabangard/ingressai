"use client";
import Loader from "@/components/shared/loader/Loader";
import Error from "@/components/shared/error/Error";

import styles from "./global-data-wrapper.module.css";

const GlobalDataWrapper = ({
  children,
  loading,
  error,
  isRefreshActive = true,
}) => {
  if (loading) {
    return (
      <section className={styles.loadingContainer}>
        <Loader color="primary" size="medium" />
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.loadingContainer}>
        <Error error={error} isRefreshActive={isRefreshActive} />
      </section>
    );
  }

  return children;
};

export default GlobalDataWrapper;
