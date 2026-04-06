import Image from "next/image";

import QrCode from "@/components/shared/qr-code/QrCode";

import { CERTIFICATE_TYPE_ENUMS } from "@/lib/constants/certificateTypeEnums";

import styles from "./certificate-card.module.css";
import { forwardRef } from "react";

const CertificateCard = forwardRef(
  ({ certificate, orientation = "vertical", t }, ref) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    return (
      <div
        className={`${styles.certificateWrapper} ${
          orientation === "horizontal" ? styles.horizontal : styles.vertical
        }`}
      >
        {certificate?.previewUrls?.[orientation] && (
          <Image
            className={styles.previewImg}
            src={certificate?.previewUrls?.[orientation]}
            alt="preview"
            fill={true}
          />
        )}

        <div className={styles.certificateContainer} ref={ref}>
          <div className={styles.certificateOuterBorder}>
            <div className={styles.certificateInnerBorder}>
              <div className={styles.header}>
                <div className={styles.logoAndTitle}>
                  <Image
                    src={`/images/logo-${orientation}.png`}
                    width={500}
                    height={200}
                    objectFit="contain"
                    alt="Logo"
                  />
                </div>
              </div>

              <div className={styles.name}>
                {certificate?.person?.firstName} {certificate?.person?.lastName}
              </div>
              <div className={styles.nameUnderline} />
              <div className={styles.awardedText}>{t("hasBeenAwardedThe")}</div>
              <div className={styles.diploma}>{t("diploma")}</div>
              <div className={styles.requirements}>
                {t("forSuccessfullyCompletingTheRequirementsOf")}
              </div>
              <div className={styles.course}>
                {certificate?.issuedFor || "Course Name"}
              </div>
              <div className={styles.courseUnderline} />

              <div className={styles.footer}>
                <div className={styles.date}>
                  {new Date(certificate?.issueDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    }
                  )}
                  <div className={styles.label}>{t("issueDate")}</div>
                </div>
                {certificate?.type === CERTIFICATE_TYPE_ENUMS.honours && (
                  <div className={styles.honourContainer}>
                    <div className={styles.honourCert}>
                      <Image
                        src="/images/honour-cert.png"
                        alt="Honour"
                        width={70}
                        height={70}
                      />
                      <span className={styles.honourText}>{t("honours")}</span>
                    </div>
                  </div>
                )}
                <div className={styles.signatureBlock}>
                  <div className={styles.signature}>
                    <Image
                      src="/images/signature.png"
                      alt="Signature"
                      width={100}
                      height={100}
                      objectFit="contain"
                    />
                  </div>
                  <div className={styles.label}>Imran Yusubov</div>
                </div>
              </div>

              <div className={styles.credentialId}>
                {t("credentialId")}: {certificate?.credentialId}
              </div>
              <div className={styles.qrContainer}>
                <div className={styles.qrcode}>
                  <QrCode
                    url={`${baseUrl}/certificate/${certificate?.credentialId}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default CertificateCard;
