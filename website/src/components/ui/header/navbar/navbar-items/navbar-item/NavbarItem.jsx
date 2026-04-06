"use client";
import LocaleLink from "@/components/shared/locale-link/LocaleLink";

import { useI18n } from "@/locales/client";

import styles from "./navbar-item.module.css";

const NavbarItem = ({ item, isLast, onClick }) => {
  const t = useI18n();

  return (
    <div className={styles.navbarItemContainer}>
      <div className={styles.navbarItem}>
        <LocaleLink href={item.url} onClick={onClick} className={styles.navbarItemText}>
          {t(item.key)}
        </LocaleLink>
      </div>
      {!isLast && <div className={styles.navbarItemDivider} />}
    </div>
  );
};

export default NavbarItem;
