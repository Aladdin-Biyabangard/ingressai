"use client";

import { useI18n } from "@/locales/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./success-modal.module.css";

const SuccessModal = ({ isOpen, onClose, message, title }) => {
  const t = useI18n();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/");
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isOpen, router]);

  if (!isOpen) return null;

  const handleRedirect = () => {
    onClose();
    router.push("/");
  };

  const handleAnotherForm = () => {
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span className={styles.topLink} onClick={handleAnotherForm}>
          {t("anotherForm")}
        </span>

        <div className={styles.iconCircle}>
          <svg
            style={{ width: "40px", height: "40px", color: "white" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className={`${styles.title} success-modal-GTM`}>{t(title)}</h2>

        <p className={styles.message}>{t(message)}</p>

        <button onClick={handleRedirect} className={styles.button}>
          {t("backToHome")}
        </button>

        <p className={styles.countdown}>
          {t("redirectingIn")} {countdown} {t("seconds")}...
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
