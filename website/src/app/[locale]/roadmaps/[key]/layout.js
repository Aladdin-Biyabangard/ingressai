import { use } from "react";

import { RoadmapProvider } from "@/contexts/RoadmapContext";

const RoadmapLayout = ({ children, params }) => {
  const { key } = use(params);
  return <RoadmapProvider trainingKey={key}>{children}</RoadmapProvider>;
};

export default RoadmapLayout;
