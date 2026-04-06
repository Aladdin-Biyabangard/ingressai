import { notFound } from "next/navigation";
import { cache } from "react";
import Vacancy from "@/components/pages/vacancy/Vacancy";
import { getVacancyData } from "@/lib/utils/api/vacancy";
import { getHomeData } from "@/lib/utils/api/home";
import {
  ERROR_ENUMS,
  errorCodes,
  errorResponses,
} from "@/lib/constants/errorCodes";

// Cache API calls to avoid duplicate requests
const getCachedVacancyData = cache(getVacancyData);
const getCachedHomeData = cache(getHomeData);

export async function generateMetadata({ params }) {
  const { id, locale } = await params;

  try {
    // Run API calls in parallel instead of sequentially
    const [vacancy, homeData] = await Promise.all([
      getCachedVacancyData(id),
      getCachedHomeData(locale)
    ]);
    const { organization } = homeData;

    if (errorResponses[vacancy]) {
      return errorResponses[vacancy];
    }

    return {
      title: vacancy?.metaTitle,
      description: vacancy?.metaDescription,
      keywords: vacancy?.searchKeys || [],
      openGraph: {
        title: vacancy?.metaTitle,
        description: vacancy?.metaDescription,
        url: `${organization?.url}/${locale}/vacancies/${id}`,
        siteName: organization?.name,
        type: "website",
      },
      alternates: {
        canonical: `${organization?.url}/${locale}/vacancies/${id}`,
        languages: {
          az: `${organization?.url}/az/vacancies/${id}`,
          en: `${organization?.url}/en/vacancies/${id}`,
        },
      },
    };
  } catch (err) {
    return errorResponses[ERROR_ENUMS.maintenance];
  }
}

export default async function VacancyPage({ params }) {
  const { id } = await params;
  
  // Use cached function - data is already fetched in generateMetadata
  const vacancy = await getCachedVacancyData(id);
  
  if (vacancy === errorCodes.certificate.maintenance || !vacancy) {
    notFound();
  }

  return <Vacancy vacancyId={id} />;
}

