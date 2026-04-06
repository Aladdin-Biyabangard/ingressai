"use client";
import React from "react";
import Image from "next/image";
import LocaleLink from "../locale-link/LocaleLink";

import { useI18n } from "@/locales/client";

import ImgSkeleton from "../img-skeleton/ImgSkeleton";

import { routes } from "@/lib/constants/routes";

import styles from "./mobile-course.module.css";

const MobileCourse = ({
  course,
  duration = false,
  lines = 2,
  onClose,
  courseStyle,
}) => {
  const t = useI18n();


  return (
    <LocaleLink onClick={onClose} href={`${routes.trainings}/${course?.id}`}>
      <div className={styles.course}>
        <div className={styles.courseIcon}>
          <ImgSkeleton
            type="training"
            obj={course}
            keyName="icon"
             isRounded={false}
            style={courseStyle}
          />
        </div>
        <div className={styles.courseInfo}>
          <div className={styles.courseHeader}>
            <div className={styles.courseHeaderIcon}>
              <Image
                src="/icons/course.svg"
                height={14}
                width={14}
                alt="Course"
                loading="lazy"
              />
              <div className={styles.courseType}>{course?.courseType}</div>
            </div>
            <div className={styles.courseDivider} />
            <div className={styles.courseLevel}>{course?.level}</div>
          </div>
          <div className={styles.courseBody}>
            <div className={styles.courseBodyEllipsis}>
              <h3 className={styles.courseName}>{course?.name}</h3>
              <p
                className={styles.courseTitle}
                style={{ WebkitLineClamp: lines }}
              >
                {course?.description}
              </p>
            </div>
            {duration && (
              <div className={styles.courseDuration}>
                <Image
                  src="/icons/duration.svg"
                  height={18}
                  width={18}
                  alt="Duration"
                  loading="lazy"
                />
                <div className={styles.courseDurationInfo}>
                  {course?.duration} {t("months")} / {course?.lessonHour}{" "}
                  {t("hours")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LocaleLink>
  );
};

export default MobileCourse;
