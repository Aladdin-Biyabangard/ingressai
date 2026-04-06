"use client";
import { useGlobalData } from "@/contexts/GlobalDataContext";

import styles from "./whatsapp-icon.module.css";

const WhatsappIcon = () => {
  const { data } = useGlobalData();

  const number = data?.organization?.phoneNumbers?.[0]?.split(" ")?.join("");

  return (
    <a
      href={number ? `https://wa.me/${number}` : "#"}
      className={styles.whatsappIcon}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
    >
      <img src="/icons/WhatsApp.webp" alt="WhatsApp" />
    </a>
  );
};

export default WhatsappIcon;
