import Scholarship from "@/components/pages/scholarship/Scholarship";

import { ERROR_ENUMS, errorResponses } from "@/lib/constants/errorCodes";

import { getHomeData } from "@/lib/utils/api/home";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  try {
    const { organization } = await getHomeData(locale);

    return {
      alternates: {
        canonical: `${organization?.url}/${locale}/scholarships`,
        languages: {
          az: `${organization?.url}/az/scholarships`,
          en: `${organization?.url}/en/scholarships`,
        },
      },
    };
  } catch (err) {
    return errorResponses[ERROR_ENUMS.maintenance];
  }
}

const ScholarshipPage = () => {
  return <Scholarship />;
};

export default ScholarshipPage;
