import { use } from "react";

import { TrainingProvider } from "@/contexts/TrainingContext";

const TrainingLayout = ({ children, params }) => {
  const { key } = use(params);
  return <TrainingProvider trainingKey={key}>{children}</TrainingProvider>;
};

export default TrainingLayout;
