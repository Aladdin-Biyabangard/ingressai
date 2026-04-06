import { notFound } from "next/navigation";
import { cache } from "react";

import Training from "@/components/pages/training/Training";

import { getTrainingData } from "@/lib/utils/api/training";
import { getHomeData } from "@/lib/utils/api/home";
import { generateSchema } from "@/lib/utils/helpers";

import {
  ERROR_ENUMS,
  errorCodes,
  errorResponses,
} from "@/lib/constants/errorCodes";

// Cache API calls to avoid duplicate requests between generateMetadata and page component
const getCachedTrainingData = cache(getTrainingData);
const getCachedHomeData = cache(getHomeData);

export async function generateMetadata({ params }) {
  const { key, locale } = await params;

  try {
    const [homeData, training] = await Promise.all([
      getCachedHomeData(locale),
      getCachedTrainingData(key)
    ]);
    const { organization } = homeData;

    if (errorResponses[training]) {
      return errorResponses[training];
    }

    return {
      title: training.metaTitle,
      description: training.metaDescription,
      keywords: training.searchKeys || [],
      openGraph: {
        title: training.metaTitle,
        description: training.metaDescription,
        url: `${organization?.url}/${locale}/trainings/${key}`,
        siteName: organization?.name,
        images: [
          {
            url: training.icon,
            width: 1200,
            height: 630,
            alt: training.metaTitle,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: training.metaTitle,
        description: training.metaDescription,
        images: [
          {
            url: training.icon,
            width: 1200,
            height: 630,
            alt: training.name,
          },
        ],
      },
      alternates: {
        canonical: `${organization?.url}/${locale}/trainings/${key}`,
        languages: {
          az: `${organization?.url}/az/trainings/${key}`,
          en: `${organization?.url}/en/trainings/${key}`,
        },
      },
    };
  } catch (err) {
    return errorResponses[ERROR_ENUMS.maintenance];
  }
}

export default async function TrainingPage({ params }) {
  const { key } = await params;

  // Use cached functions - data is already fetched in generateMetadata
  const [training, homeData] = await Promise.all([
    getCachedTrainingData(key),
    getCachedHomeData()
  ]);

  if (training === errorCodes.training.notFound) {
    notFound();
  }

  const { organization } = homeData;

  const optimizedSchema = generateSchema("course", {
    training,
    organization,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(optimizedSchema) }}
      />
      <Training trainingKey={key} />
    </>
  );
}
