"use client";
import Image from "next/image";
import { useI18n } from "@/locales/client";
import { useEffect, useState } from "react";
import { GiDuration } from "react-icons/gi";

import styles from "./error.module.css";

export default function Error({ isRefreshActive = true, error }) {
  const t = useI18n();
  const [secondsLeft, setSecondsLeft] = useState(30);

  const is502 = error === 502;
  const is500 = error === 500;

  useEffect(() => {
    if (is502 && isRefreshActive) {
      if (secondsLeft === 1) {
        window.location.reload();
        return;
      }

      const timer = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [secondsLeft, is502, isRefreshActive]);

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Image
          src="/icons/maintenance.svg"
          alt="Maintenance in progress"
          width={300}
          height={300}
          className={styles.image}
          priority
        />

        {is502 ? (
          <>
            <h1 className={styles.title}>{t("maintenanceTitle")}</h1>
            <p className={styles.text}>
              {t("underMaintenance")} <br />
              {t("plsTryAgainInAFewMinutes")}
            </p>

            {isRefreshActive && (
              <div className={styles.refreshDuration}>
                <GiDuration
                  size={30}
                  color="red"
                  className={styles.refreshIcon}
                />
                <p className={styles.refreshText}>
                  {t("refreshIn")} {secondsLeft} {t("seconds")}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className={styles.title}>{t("unknownProblem")}</h1>
            <p className={styles.text}>
             {t("unknownProblemTitle")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
