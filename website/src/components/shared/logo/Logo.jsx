"use client";
import { memo } from "react";
import Image from "next/image";
import LocaleLink from "../locale-link/LocaleLink";

import { useI18n } from "@/locales/client";

import { routes } from "@/lib/constants/routes";

import styles from "./logo.module.css";

const Logo = memo(({ theme = "light", isShownBottom = false }) => {
  const t = useI18n();
  const imageSrc = theme === "light" ? "/images/logo-png.png" : "/images/logo-ingress-white.png";
  const logoBottomColor = theme === "light" ? "#233131" : "#FFFFFF";

  return (
    <div className={styles.logo}>
      <LocaleLink href={routes.home} className={styles.logoTop}>
        {/* <Image
          src="/icons/logo.svg"
          height={50}
          width={50}
          alt="Ingress Academy Logo"
          priority
        /> */}
        <Image src={imageSrc} height={50} width={200} alt="Ingress Academy Logo" priority/>
        {/* <div className={styles.logoText}>
          <div className={styles.logoTextContainer}>
            <span className={styles.logoTextLeft} style={{ color: titleColor }}>
              Ingress
            </span>
            <span
              className={styles.logoTextRight}
              style={{ color: titleColor }}
            >
              Academy
            </span>
          </div>
          <div
            className={styles.logoTextBottom}
            style={{ color: descriptionColor }}
          >
            empowered by innovation
          </div>
        </div> */}
      </LocaleLink>
      {isShownBottom && (
        <div className={styles.logoBottom} style={{ color: logoBottomColor }}>
          {t("empoweredByInnovation")}
        </div>
      )}
    </div>
  );
});

export default Logo;
