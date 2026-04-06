import React from "react";
import Graduates from "@/components/pages/graduates/Graduates";

import { ERROR_ENUMS, errorResponses } from "@/lib/constants/errorCodes";

import { getHomeData } from "@/lib/utils/api/home";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  try {
    const { organization } = await getHomeData(locale);

    return {
      alternates: {
        canonical: `${organization?.url}/${locale}/graduates`,
        languages: {
          az: `${organization?.url}/az/graduates`,
          en: `${organization?.url}/en/graduates`,
        },
      },
    };
  } catch (err) {
    return errorResponses[ERROR_ENUMS.maintenance];
  }
}
const GraduatesPage = () => {
  return <Graduates />;
};

export default GraduatesPage;
