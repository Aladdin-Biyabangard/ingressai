import { notFound } from "next/navigation";
import { cache } from "react";

import Certificate from "@/components/pages/certificate/Certificate";
import { errorCodes, errorResponses } from "@/lib/constants/errorCodes";
import { getCertificateData } from "@/lib/utils/api/certificate";
import { isValidOrientation } from "@/lib/utils/helpers/isValidOrientation";
import { getHomeData } from "@/lib/utils/api/home";

// Cache API calls to avoid duplicate requests
const getCachedCertificateData = cache(getCertificateData);
const getCachedHomeData = cache(getHomeData);

export async function generateMetadata({ params }) {
  const { id, locale, orientation } = await params;

  if (!isValidOrientation(orientation))
    errorResponses[errorCodes.certificate.notFound];

  try {
    const [homeData, certificate] = await Promise.all([
      getCachedHomeData(locale),
      getCachedCertificateData(id)
    ]);
    const { organization } = homeData;

    if (errorResponses[certificate]) {
      return errorResponses[certificate];
    }

    return {
      title: `${certificate?.person?.firstName} ${certificate?.person?.lastName} - ${certificate.issuedFor}`,
      description: certificate.description,
      keywords: ["certificate", "diploma", certificate.issuedFor],
      openGraph: {
        title: `${certificate?.person?.firstName} ${certificate?.person?.lastName} - ${certificate.issuedFor}`,
        description: certificate.description,
        type: "profile",
        url: `${organization?.url}/${locale}/certificate/${id}/preview/${orientation}`,
        siteName: organization?.name,
        images: [
          {
            url: certificate?.previewUrls?.[orientation],
            width: 1200,
            height: 630,
            alt: "Certificate img",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${certificate?.person?.firstName} ${certificate?.person?.lastName} - ${certificate.issuedFor}`,
        description: certificate.description,
        images: [
          {
            url: certificate?.previewUrls?.[orientation],
            width: 1200,
            height: 630,
            alt: "Certificate img",
          },
        ],
        creator: "@IngressAcademy",
      },
      alternates: {
        canonical: `${organization?.url}/${locale}/certificate/${id}/preview/${orientation}`,
        languages: {
          az: `${organization?.url}/az/certificate/${id}/preview/${orientation}`,
          en: `${organization?.url}/en/certificate/${id}/preview/${orientation}`,
        },
      },
    };
  } catch (err) {
    return errorResponses[errorCodes.certificate.maintenance];
  }
}
const CertificatePreviewPage = async ({ params }) => {
  const { id } = await params;

  // Use cached function - data is already fetched in generateMetadata
  const certificate = await getCachedCertificateData(id);

  if (certificate === errorCodes.certificate.notFound) notFound();

  return <Certificate hasPreview={true} />;
};

export default CertificatePreviewPage;
