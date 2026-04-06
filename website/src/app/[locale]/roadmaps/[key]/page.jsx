import Roadmap from "@/components/pages/roadmap/Roadmap";

import { ERROR_ENUMS, errorResponses } from "@/lib/constants/errorCodes";

import { getHomeData } from "@/lib/utils/api/home";

export async function generateMetadata({ params }) {
  const { key, locale } = await params;
  try {
    const { organization } = await getHomeData(locale);

    return {
      alternates: {
        canonical: `${organization?.url}/${locale}/roadmaps/${key}`,
        languages: {
          az: `${organization?.url}/az/roadmaps/${key}`,
          en: `${organization?.url}/en/roadmaps/${key}`,
        },
      },
    };
  } catch (err) {
    return errorResponses[ERROR_ENUMS.maintenance];
  }
}

const RoadmapPage = () => {
  return <Roadmap />;
};

export default RoadmapPage;
