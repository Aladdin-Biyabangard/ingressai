import Vacancies from "@/components/pages/vacancies/Vacancies";
import { ERROR_ENUMS, errorResponses } from "@/lib/constants/errorCodes";
import { getHomeData } from "@/lib/utils/api/home";
import { getSeoData } from "@/lib/utils/api/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  try {
    const [homeData, seo] = await Promise.all([
      getHomeData(locale),
      getSeoData('vacancies', locale)
    ]);
    const { organization } = homeData;

    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      keywords: seo.searchKeys,
      alternates: {
        canonical: `${organization?.url}/${locale}/vacancies`,
        languages: {
          az: `${organization?.url}/az/vacancies`,
          en: `${organization?.url}/en/vacancies`,
        },
      },
      openGraph: {
        title: seo.metaTitle,
        description: seo.metaDescription,
        url: `${organization?.url}/${locale}/vacancies`,
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
        title: seo.metaTitle,
        description: seo.metaDescription,
        images: [organization?.logo],
      },
    };
  } catch (err) {
    return errorResponses[ERROR_ENUMS.maintenance];
  }
}

const VacanciesPage = () => {
  return <Vacancies />;
};

export default VacanciesPage;

