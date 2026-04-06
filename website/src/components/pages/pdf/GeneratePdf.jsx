"use client";
import { useRef } from "react";
import { useI18n } from "@/locales/client";
import { useTraining } from "@/contexts/TrainingContext";

import Advantages from "../../ui/training/advantages/Advantages";
import Syllabus from "../../ui/training/syllabus/Syllabus";
import Instructors from "../../ui/training/instructors/Instructors";
import RelatedCourses from "../../ui/training/related-courses/RelatedCourses";
import TrainingTitle from "../../ui/training/training-title/TrainingTitle";

import styles from "./generate-pdf.module.css";
import { notFound } from "next/navigation";

export default function GeneratePdf() {
  const { training, error, loading } = useTraining();
  const t = useI18n();
  const pdfRef = useRef();

  const getFirstThreeSentences = (text = "") => {
    const sentences = text.split(/(?<=[.?!])\s+/).slice(0, 3);
    const result = sentences.join(" ");

    // Çok uzun metinleri sınırla (yaklaşık 200 karakter)
    if (result.length > 200) {
      return result.substring(0, 200) + "...";
    }
    return result;
  };

  // Uzun başlıkları sınırla
  const truncateTitle = (title = "", maxLength = 100) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  if (error) {
    notFound();
  }

  const createPage = (content, url, isNewSection = false) => (
    <div className={`${styles.page} ${isNewSection ? styles.newSection : ""}`}>
      <div className={styles.pageWrapper}>
        <img
          src={url}
          alt="background"
          className={styles.bg}
          width="595"
          height="842"
        />
        <div className={styles.pageContent}>
          <div className={styles.contentContainer}>{content}</div>
        </div>
      </div>
    </div>
  );

  const createPageWithFade = (content, url, isNewSection = false) => (
    <div className={`${styles.page} ${isNewSection ? styles.newSection : ""}`}>
      <div className={styles.pageWrapper}>
        <img
          src={url}
          alt="background"
          className={styles.bg}
          width="595"
          height="842"
        />
        <div className={styles.pageContent}>
          <div className={`${styles.contentContainer} ${styles.fadeBottom}`}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={pdfRef} className={styles.pdf}>
      {/* Cover Page */}
      <div className={styles.page}>
        <div className={styles.pageWrapper}>
          <img
            src="/images/pdf-cover.jpg"
            alt="cover"
            className={styles.bg}
            width="595"
            height="842"
          />
          <div className={styles.coverContent}>
            <h1 className={styles.trainingTitle}>
              {truncateTitle(training?.name)}
            </h1>
            <p className={styles.trainingDescription}>
              {getFirstThreeSentences(training?.description)}
            </p>
          </div>
        </div>
      </div>

      {/* Training Title - New Section */}
      {createPage(
        <TrainingTitle training={training} t={t} />,
        "/images/pdf-bg.jpg",
        true
      )}

      {/* Advantages - New Section */}
      {createPageWithFade(
        <Advantages
          advantages={training?.advantages}
          t={t}
          title="advantages"
        />,
        "/images/pdf-bg.jpg",
        true
      )}

      {/* Syllabus - New Section with auto-pagination */}
      <div className={styles.syllabusSection}>
        <div className={styles.syllabusPage}>
          <img
            src="/images/pdf-bg.jpg"
            alt="background"
            className={styles.bg}
            width="595"
            height="842"
          />
          <div className={styles.syllabusContent}>
            <div className={styles.syllabusScrollContainer}>
              <Syllabus
                pdfView={true}
                t={t}
                title="trainingProgram"
                error={error}
                loading={loading}
                trainingProgram={{
                  name: training?.name,
                  lessons: training?.syllabus,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Instructors - New Section */}
      {createPageWithFade(
        <Instructors
          error={error}
          loading={loading}
          t={t}
          title="instructors"
          instructors={training?.instructors}
        />,
        "/images/pdf-bg.jpg",
        true
      )}

      {/* Related Courses - New Section */}
      {createPageWithFade(
        <RelatedCourses
          showSlider={false}
          t={t}
          title="relatedCourses"
          error={error}
          loading={loading}
          relatedCourses={training?.relatedCourses}
        />,
        "/images/pdf-bg.jpg",
        true
      )}
      {createPageWithFade(<div></div>, "/images/pdf-last.jpg", true)}
    </div>
  );
}
