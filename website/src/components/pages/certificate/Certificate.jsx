"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";
import CertificateCard from "@/components/ui/certificate/certificate-card/CertificateCard";
import CertificateDetails from "@/components/ui/certificate/certificate-details/CertificateDetails";
import ShareCertificate from "@/components/ui/certificate/share-certificate/ShareCertificate";

import { useCertificate } from "@/contexts/CertificateContext";

import styles from "./certificate.module.css";
import { useI18n } from "@/locales/client";

const Certificate = ({ hasPreview }) => {
  const { certificate, loading, error, platform, setOrientation, orientation } =
    useCertificate();

  const certificateCardRef = useRef(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const t = useI18n();

  const router = useRouter();
  const pathname = usePathname();

  const handleDownloadPdf = async () => {
    try {
      setLoadingPdf(true);
      const element = certificateCardRef.current;
      const isLandscape = orientation === "horizontal";

      const imgWidth = isLandscape ? 1000 : 550;
      const imgHeight = isLandscape ? 707 : 777;

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        height: imgHeight,
        width: imgWidth,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF(isLandscape ? "landscape" : "portrait", "pt", [
        imgWidth,
        imgHeight,
      ]);

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const fileName = certificate.name
        ? `${certificate.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`
        : `cert-${certificate?.credentialId}-${orientation}.pdf`;

      pdf.save(fileName);
      setLoadingPdf(false);
    } catch (err) {
      console.error(err);
      setLoadingPdf(false);
    }
  };

  const handleChangeOrientation = (newOrientation) => {
    const params = new URLSearchParams();

    params.append("orientation", newOrientation);
    if (platform) params.append("platform", platform);

    setOrientation(newOrientation);

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.push(newUrl, { scroll: false });
  };

  return (
    <GlobalDataWrapper loading={loading} error={error}>
      <section className={styles.certificate}>
        <CertificateCard
          certificate={certificate}
          orientation={orientation}
          ref={certificateCardRef}
          t={t}
        />
        {!hasPreview && (
          <>
            <ShareCertificate
              certificate={certificate}
              setOrientation={handleChangeOrientation}
              orientation={orientation}
              handleDownloadPdf={handleDownloadPdf}
              loadingPdf={loadingPdf}
              t={t}
            />
            <CertificateDetails certificate={certificate} t={t} />
          </>
        )}
      </section>
    </GlobalDataWrapper>
  );
};

export default Certificate;
