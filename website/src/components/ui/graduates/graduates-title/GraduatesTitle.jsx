"use client";

import { useMemo } from "react";
import Image from "next/image";

import { useI18n } from "@/locales/client";

import { useGlobalData } from "@/contexts/GlobalDataContext";
import ImgSkeleton from "@/components/shared/img-skeleton/ImgSkeleton";
import Loader from "@/components/shared/loader/Loader";
import styles from "./graduates-title.module.css";

export default function GraduatesTitle({ loading = false, error }) {
  const { data } = useGlobalData();

  const t = useI18n();

  // Shuffle and pick 3 random instructors from the already-fetched list
  const instructors = data.instructors || [];
  const randomInstructors = useMemo(() => {
    if (instructors.length < 3) return instructors;
    const shuffled = [...instructors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [instructors]);

  return (
    <section className={styles.graduatesTitle}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader color="primary" size="medium" />
        </div>
      ) : error ? (
        <div className={styles.loaderContainer}>{error}</div>
      ) : (
        <div className={styles.graduatesContent}>
          <div className={styles.diamondLayout}>
            {/* Big left diamond */}
            <div className={styles.bigDiamond}>
              <div className={styles.bigDiamondImageWrapper}>
                <Image
                  src="/images/close-up-graduation-certificate.svg"
                  alt="Certificate"
                  fill
                  className={styles.bigDiamondImage}
                  priority
                />
              </div>
            </div>
            {/* Top small diamond */}
            <div className={`${styles.smallDiamond} ${styles.topDiamond}`}>
              <div className={styles.smallDiamondImageWrapper}>
                {randomInstructors[0]?.image && (
                  <ImgSkeleton
                    obj={randomInstructors[0]}
                    keyName="image"
                    type="instructor"
                    style={{}}
                    borderRadius="50%"
                    skeletonColor="#E3E3E3"
                  />
                )}
              </div>
            </div>
            {/* Right small diamond */}
            <div className={`${styles.smallDiamond} ${styles.rightDiamond}`}>
              <div className={styles.smallDiamondImageWrapper}>
                {randomInstructors[1]?.image && (
                  <ImgSkeleton
                    obj={randomInstructors[1]}
                    keyName="image"
                    type="instructor"
                    style={{}}
                    borderRadius="50%"
                    skeletonColor="#E3E3E3"
                  />
                )}
              </div>
            </div>
            {/* Bottom small diamond */}
            <div className={`${styles.smallDiamond} ${styles.bottomDiamond}`}>
              <div className={styles.smallDiamondImageWrapper}>
                {randomInstructors[2]?.image && (
                  <ImgSkeleton
                    obj={randomInstructors[2]}
                    keyName="image"
                    type="instructor"
                    style={{}}
                    borderRadius="50%"
                    skeletonColor="#E3E3E3"
                  />
                )}
              </div>
            </div>
          </div>
          <div className={styles.graduatesText}>
            <h2>
              <span className={styles.blue}>{t("ourGraduates")}</span>
              {t("reflectOurValues")}
            </h2>
            <p>{t("graduateDescription")}</p>
          </div>
        </div>
      )}
    </section>
  );
}
