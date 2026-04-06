import { notFound } from "next/navigation";
import { cache } from "react";

import Certificate from "@/components/pages/certificate/Certificate";

import { errorCodes, errorResponses } from "@/lib/constants/errorCodes";
import { getCertificateData } from "@/lib/utils/api/certificate";

import { getHomeData } from "@/lib/utils/api/home";
import { convertPlatform } from "@/lib/utils/helpers/convertPlatform";
import { isValidOrientation } from "@/lib/utils/helpers/isValidOrientation";
import { CERTIFICATE_DEFAULT_TYPE } from "@/lib/constants/shareCertificateEnums";

// Cache API calls to avoid duplicate requests
const getCachedCertificateData = cache(getCertificateData);
const getCachedHomeData = cache(getHomeData);

export async function generateMetadata({ params, searchParams }) {
  const { id, locale } = await params;

  let { platform, orientation } = await searchParams;

  if (!isValidOrientation(orientation))
    errorResponses[errorCodes.certificate.notFound];

  platform = convertPlatform(platform);

  const platformQuery = platform ? `?platform=${platform}` : "";

  try {
    const [homeData, certificate] = await Promise.all([
      getCachedHomeData(locale),
      getCachedCertificateData(id)
    ]);
    const { organization } = homeData;

    const isHorizontal = orientation === CERTIFICATE_DEFAULT_TYPE;

    const imageWidth = isHorizontal ? 1000 : 550;
    const imageHeight = isHorizontal ? 707 : 777;

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
        url: `${organization?.url}/${locale}/certificate/${id}${platformQuery}`,
        siteName: organization?.name,
        images: [
          {
            url: certificate?.previewUrls?.[
              orientation ?? CERTIFICATE_DEFAULT_TYPE
            ],
            width: imageWidth,
            height: imageHeight,
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
        canonical: `${organization?.url}/${locale}/certificate/${id}`,
        languages: {
          az: `${organization?.url}/az/certificate/${id}`,
          en: `${organization?.url}/en/certificate/${id}`,
        },
      },
    };
  } catch (err) {
    return errorResponses[errorCodes.certificate.maintenance];
  }
}

const CertificatePage = async ({ params, searchParams }) => {
  const { id } = await params;
  const { platform } = await searchParams;

  // Use cached function - data may already be fetched in generateMetadata
  const certificate = await getCachedCertificateData(id, convertPlatform(platform));

  if (certificate === errorCodes.certificate.notFound) notFound();

  return <Certificate hasPreview={false} />;
};

export default CertificatePage;
