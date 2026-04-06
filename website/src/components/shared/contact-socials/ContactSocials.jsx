"use client";
import { useGlobalData } from "@/contexts/GlobalDataContext";

import { filterArray } from "@/lib/utils/helpers";
import { contactSocials } from "@/lib/constants/contact";

import styles from "./contact-social.module.css";

const ContactSocials = () => {
  const {
    data: { organization },
  } = useGlobalData();

  return (
    <div className={styles.contactInfoSocials}>
      {filterArray(contactSocials, "youtube").map((item) => (
        <a
          href={organization?.socialLinks?.[item.key] || ""}
          key={item.key}
          title={item.key}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactInfoSocialsLink}
          data-social={item.key}
        >
          <item.icon className={styles.contactInfoSocialIcon} size={18} />
        </a>
      ))}
    </div>
  );
};

export default ContactSocials;
