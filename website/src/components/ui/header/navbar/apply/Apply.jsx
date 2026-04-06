"use client";
import LocaleLink from "@/components/shared/locale-link/LocaleLink";

import { useI18n } from "@/locales/client";

import { routes } from "@/lib/constants/routes";

import styles from "./apply.module.css";


const Apply = () => {
  const t = useI18n();
  return (
    <LocaleLink href={routes.trainingApplication} className={styles.navbarItemText}>
      {t("applyNow")}
    </LocaleLink>
  );
};

export default Apply;
