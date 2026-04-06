import LocaleLink from "@/components/shared/locale-link/LocaleLink";

import { RiLoader2Fill } from "react-icons/ri";
import { MdOutlineFileDownload } from "react-icons/md";

import { routes } from "@/lib/constants/routes";

import { convertStringToDate } from "@/lib/utils/helpers";

import styles from "./next-group.module.css";


const NextGroup = ({
  isDownloadingSyllabus = false,
  t,
  onClickApply,
  url,
  nextGroup,
  training
}) => {
  const formatted = convertStringToDate(nextGroup?.startDate);

  return (
    <div className={styles.nextGroup}>
      {nextGroup?.startDate && (
        <div className={styles.nextGroupTop}>
          <div>{t("upcomingGroup")}:</div>
          <p>{formatted}</p>
        </div>
      )}
      <div className={styles.nextGroupContent}>{t("upcomingGroupContent")}</div>
      <div className={styles.nextGroupBtnGroup}>
        <a href={url} target="_blank">
          <button
            className={styles.nextGroupSyllabus}
            disabled={isDownloadingSyllabus}
          >
            {isDownloadingSyllabus ? (
              <RiLoader2Fill size={20} className={styles.loaderIcon} />
            ) : (
              <>
                <MdOutlineFileDownload
                  size={20}
                  style={{ marginRight: 5 }}
                  height={20}
                  width={20}
                />
                {t("trainingProgram")}
              </>
            )}
          </button>
        </a>

        <LocaleLink href={`${routes.trainingApplication}?trainingId=${training?.id}`}>
          <button className={styles.nextGroupApply}>
            {t("apply")}
          </button>
        </LocaleLink>
      </div>
    </div>
  );
};

export default NextGroup;
