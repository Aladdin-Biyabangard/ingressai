"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { useI18n } from "@/locales/client";

import styles from "./count.module.css";

const Count = ({ count, isLast }) => {
  const t = useI18n();

  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    let start = 0;
    let rawValue =
      typeof count?.value === "string"
        ? count.value.replace("%", "")
        : count.value;
    const end = Number(rawValue);
    const duration = 3000;
    const stepTime = 20;
    const steps = duration / stepTime;

    const increment = end / steps;

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedCount(end);
        clearInterval(counter);
      } else {
        setAnimatedCount(start);
      }
    }, stepTime);

    return () => clearInterval(counter);
  }, [count?.value]);

  const displayValue = `${animatedCount.toFixed(1)}%`;

  return (
    <div className={styles.count}>
      <div className={styles.countDetails}>
        <div className={styles.countDetailsTop}>
          <Image src={count?.icon} alt={count?.title} width={32} height={32} />
          <p className={styles.countNumber}>{displayValue}</p>
        </div>
        <div className={styles.countContent}>
          <p className={styles.countTitle}>{count?.title}</p>
          <p className={styles.countDescription}>{count?.description}</p>{" "}
        </div>
      </div>
      {!isLast && <div className={styles.countLine}></div>}
    </div>
  );
};

export default Count;
