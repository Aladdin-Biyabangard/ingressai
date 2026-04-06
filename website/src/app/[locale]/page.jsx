import { cache } from "react";
import Home from "@/components/pages/home/Home.jsx";
import { errorCodes, errorResponses } from "@/lib/constants/errorCodes";

import { getHomeData } from "@/lib/utils/api/home";
import { getSeoData } from "@/lib/utils/api/seo";
import { generateSchema } from "@/lib/utils/helpers";

const getCachedHomeData = cache(getHomeData);

export async function generateMetadata({ params }) {
  const { locale } = await params;
  try {
    const [homeData, seo] = await Promise.all([
      getCachedHomeData(locale),
      getSeoData('home', locale)
    ]);
    const { organization } = homeData;

    if (!organization || Object.keys(organization).length === 0) {
      return errorResponses[errorCodes.home.maintenance];
    }
    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      keywords: seo.searchKeys,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      icons: {
        icon: [{ url: "en/favicon.ico" }, { url: "/icon.svg" }],
        apple: [{ url: "en/apple-icon.svg" }],
      },
      openGraph: {
        title: seo.metaTitle,
        description: seo.metaDescription,
        url: `${organization?.url}/${locale}`,
        siteName: organization?.name,
        images: [
          {
            url: organization?.logo,
            width: 1200,
            height: 630,
            alt: organization?.name,
          },
        ],
        locale,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seo.metaTitle,
        description: seo.metaDescription,
        images: [organization?.logo],
      },
      alternates: {
        canonical: `${organization?.url}/${locale}`,
        languages: {
          az: `${organization?.url}/az`,
          en: `${organization?.url}/en`,
        },
      },
      other: {
        "google-site-verification":
          "ARdGi_zqdUHiW0AOgeEkc1PiaGQQGSNdrHIKmUm4apg",
        "Content-Security-Policy": "default-src 'self'",
      },
    };
  } catch (_) {
    return errorResponses[errorCodes.home.maintenance];
  }
}

export default async function HomePage() {
  let optimizedSchema = null;
  try {
    // Use cached function - data is already fetched in generateMetadata
    const { organization } = await getCachedHomeData();

    optimizedSchema = generateSchema("organization", organization);
  } catch (_) { }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(optimizedSchema) }}
      />
      <Home />
    </>
  );
}
