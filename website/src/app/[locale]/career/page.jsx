import Career from "@/components/pages/career/Career";

import { ERROR_ENUMS, errorResponses } from "@/lib/constants/errorCodes";

import { getHomeData } from "@/lib/utils/api/home";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  try {
    const { organization } = await getHomeData(locale);

    return {
      alternates: {
        canonical: `${organization?.url}/${locale}/career`,
        languages: {
          az: `${organization?.url}/az/career`,
          en: `${organization?.url}/en/career`,
        },
      },
    };
  } catch (err) {
    return errorResponses[ERROR_ENUMS.maintenance];
  }
}
const CareerPage = () => {
  return <Career />;
};

export default CareerPage;
