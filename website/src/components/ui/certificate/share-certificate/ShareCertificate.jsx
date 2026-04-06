"use client";

import { useState } from "react";
import Image from "next/image";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RectangleHorizontal, RectangleVertical } from "lucide-react";

import {
  handleShare,
  handleCopyLink,
} from "@/lib/utils/helpers/certificateActions";

import { SHARE_CERTIFICATE_ENUMS } from "@/lib/constants/shareCertificateEnums";

import styles from "./share-certificate.module.css";

const ShareCertificate = ({
  certificate,
  setOrientation,
  orientation,
  handleDownloadPdf,
  loadingPdf,
  t,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);


  return (
    <section className={styles.shareSection}>
      <div className={styles.shareContainer}>
        <h2 className={styles.shareTitle}>
          {t("shareYourAchievement")}
          <div className={styles.thumbnails}>
            {[
              { dir: "vertical", Icon: RectangleVertical },
              { dir: "horizontal", Icon: RectangleHorizontal },
            ].map(({ dir, Icon }) => (
              <div
                key={dir}
                className={styles.thumbnail}
                onClick={() => setOrientation(dir)}
              >
                <Icon
                  size={32}
                  className={
                    orientation === dir
                      ? styles.activeIcon
                      : styles.inactiveIcon
                  }
                />
              </div>
            ))}
          </div>
        </h2>
        <p className={styles.shareDescription}>{t("shareDescription")}</p>
        <div className={styles.shareButtons}>
          <button
            className={styles.shareButton}
            aria-label="Share on WhatsApp"
            onClick={() =>
              handleShare(SHARE_CERTIFICATE_ENUMS.whatsapp, certificate)
            }
          >
            <Image
              src="/icons/WhatsApp.webp"
              width={24}
              height={24}
              alt="WhatsApp"
            />
            <span>WhatsApp</span>
          </button>
          <button
            className={styles.shareButton}
            aria-label="Share on LinkedIn"
            onClick={() =>
              handleShare(SHARE_CERTIFICATE_ENUMS.linkedin, certificate)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#0A66C2"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <span>LinkedIn</span>
          </button>
          <button
            className={styles.shareButton}
            aria-label="Share on Facebook"
            onClick={() =>
              handleShare(SHARE_CERTIFICATE_ENUMS.facebook, certificate)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#1877F2"
            >
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
            <span>Facebook</span>
          </button>
          <button
            className={styles.copyLinkButton}
            aria-label="Copy Link"
            onClick={() => handleCopyLink(setCopySuccess)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#555"
            >
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
            </svg>
            <span>{copySuccess ? t("copied") : t("copyLink")}</span>
          </button>
          <button
            className={styles.downloadButton}
            aria-label="Download PDF"
            onClick={handleDownloadPdf}
            disabled={loadingPdf}
          >
            {loadingPdf ? (
              <AiOutlineLoading3Quarters className={styles.spinner} />
            ) : (
              <HiOutlineDocumentArrowDown />
            )}
            <span>{loadingPdf ? "Loading..." : t("downloadPDF")}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShareCertificate;
