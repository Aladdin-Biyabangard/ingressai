"use client";
import Image from "next/image";

import { useI18n } from "@/locales/client";
import { useGlobalData } from "@/contexts/GlobalDataContext";

import { generateLink } from "@/lib/utils/helpers";

import { contacts } from "@/lib/constants/contact";

import ContactSocials from "../contact-socials/ContactSocials";

import styles from "./get-in-touch.module.css";

const GetInTouch = () => {
  const t = useI18n();

  const {
    data: { organization },
  } = useGlobalData();

  const dynamicData = {
    email: organization?.email,
    phone: organization?.phoneNumbers?.[0],
    location: organization?.addresses?.[0]?.streetAddress,
  };

  return (
    <div className={styles.courseApplicationLeft}>
      <div className={styles.courseApplicationLeftTop}>
        <h3 className={styles.courseApplicationLeftTopTitle}>
          {t("getInTouch")}
        </h3>
        <p className={styles.courseApplicationLeftDescription}>
          {t("contactUsDirectlyForQuickInteraction")}
        </p>
        {contacts.map((contact) => {
          const value = dynamicData?.[contact.key] || "";
          const isEmail = contact.key === "email";

          const [user, domain] = isEmail ? value.split("@") : [];

          return (
            <div className={styles.courseApplicationContact} key={contact.key}>
              <div className={styles.courseApplicationContactIcon}>
                <Image src={contact.icon2} height={18} width={24} alt="Icon" />
              </div>
              <div>
                <div className={styles.contactForCourseApplicationContactKey}>
                  {t(contact.key)}
                </div>
                {isEmail ? (
                  <a
                    href={`mailto:${user}@${domain}`}
                    className={styles.contactForCourseApplicationContactText}
                  >
                    {user}
                    <span>@</span>
                    {domain}
                  </a>
                ) : (
                  <a
                    href={generateLink(contact.key, value)}
                    className={styles.contactForCourseApplicationContactText}
                  >
                    {t(value)}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.courseApplicationLeftBottom}>
        <div className={styles.courseApplicationLeftBottomTitle}>
          {t("socialMedia")}
        </div>
        <ContactSocials />
      </div>
    </div>
  );
};

export default GetInTouch;
