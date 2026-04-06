import { use } from "react";

import CourseApplication from "@/components/pages/training-application/CourseApplication";

import { ERROR_ENUMS, errorResponses } from "@/lib/constants/errorCodes";

import { getHomeData } from "@/lib/utils/api/home";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  try {
    const { organization } = await getHomeData(locale);

    return {
      alternates: {
        canonical: `${organization?.url}/${locale}/training-application`,
        languages: {
          az: `${organization?.url}/az/training-application`,
          en: `${organization?.url}/en/training-application`,
        },
      },
    };
  } catch (err) {
    return errorResponses[ERROR_ENUMS.maintenance];
  }
}

const CourseApplicationPage = ({ searchParams }) => {
  return <CourseApplication params={use(searchParams)} />;
};

export default CourseApplicationPage;
