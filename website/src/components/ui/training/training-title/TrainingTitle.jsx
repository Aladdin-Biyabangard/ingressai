import Image from "next/image";

import ImgSkeleton from "@/components/shared/img-skeleton/ImgSkeleton";

import { convertWeekToHour } from "@/lib/utils/helpers";
import { convertWeekMonth } from "@/lib/utils/helpers/convertWeekToMonth";

import {
  LESSON_TYPES_ENUM,
  LESSON_TYPES_ICON,
} from "@/lib/constants/lessonTypes";

import styles from "./training-title.module.css";

const TrainingTitle = ({ training, t }) => {

  return (
    <section className={styles.trainingTitle}>
      <div className={styles.trainingTitleContainer}>
        <div className={styles.trainingTitleLeft}>
          {training?.name && <h1>{training.name}</h1>}
          {training?.description && <p>{training.description}</p>}

          <div className={styles.trainingDurationBox}>
            {training?.courseFormat && (
              <div className={styles.trainingType}>
                {LESSON_TYPES_ICON[training.courseFormat]}
                <div className={styles.durationInfoWrapper}>
                  <span>{t(LESSON_TYPES_ENUM[training.courseFormat])}</span>
                </div>
              </div>
            )}

            {(training?.durationInWeeks ||
              training?.hoursPerSession ||
              training?.sessionsPerWeek) && (
                <div className={styles.trainingDuration}>
                  <Image
                    src="/icons/duration.svg"
                    height={18}
                    width={18}
                    alt="Duration icon"
                    loading="lazy"
                  />
                  <div className={styles.durationInfoWrapper}>
                    {training?.durationInWeeks && (
                      <>
                        <span>
                          {convertWeekMonth(training.durationInWeeks)}{" "}
                          {t("months")}
                        </span>
                        <span>
                          {training.durationInWeeks} {t("weeks")}
                        </span>
                      </>
                    )}

                    {training?.hoursPerSession && training?.sessionsPerWeek && (
                      <span>
                        {convertWeekToHour(
                          training.durationInWeeks,
                          training.hoursPerSession,
                          training.sessionsPerWeek
                        )}{" "}
                        {t("hours")}
                      </span>
                    )}

                    {training?.hoursPerSession && (
                      <span>
                        {training.hoursPerSession} {t("hours")}/{t("lesson")}
                      </span>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className={styles.trainingTitleRight}>

          <ImgSkeleton
            obj={training}
            keyName="icon"
            isRounded={false}
            borderRadius="8px"
          />
        </div>
      </div>
    </section>
  );
};

export default TrainingTitle;
