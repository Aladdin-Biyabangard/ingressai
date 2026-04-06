"use client";
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

import { errorCodes, errorResponses } from "@/lib/constants/errorCodes";
import { getGraduates } from "@/lib/utils/api/graduates";
import { getTrainingData } from "@/lib/utils/api/training";
import { useParams } from "next/navigation";

const TrainingContext = createContext();

export const TrainingProvider = ({ children, trainingKey }) => {
  const { locale } = useParams()
  console.log(locale);

  const [training, setTraining] = useState({
    advantages: [],
    description: "",
    durationInWeeks: 0,
    faq: [],
    graduatesWorkplaces: [],
    graduates: [],
    hoursPerSession: 0,
    icon: null,
    id: "",
    instructors: [],
    level: "",
    name: "",
    searchKeys: [],
    sessionsPerWeek: 0,
    syllabus: [],
    tags: [],
    upcomingSessions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTraining = useCallback(async () => {
    const [trainingResult, graduatesResult] = await Promise.allSettled([
      getTrainingData(trainingKey, locale),
      getGraduates(trainingKey, 0, 100, locale),
    ]);

    if (trainingResult.status === "fulfilled") {
      if (errorResponses[trainingResult.value]) {
        setError(trainingResult.value);
      } else {
        // Ensure arrays are always arrays, never undefined
        const trainingData = trainingResult.value || {};
        setTraining({
          ...trainingData,
          upcomingSessions: Array.isArray(trainingData.upcomingSessions) ? trainingData.upcomingSessions : [],
          graduates: Array.isArray(trainingData.graduates) ? trainingData.graduates : [],
          relatedCourses: Array.isArray(trainingData.relatedCourses) ? trainingData.relatedCourses : [],
          advantages: Array.isArray(trainingData.advantages) ? trainingData.advantages : [],
          faq: Array.isArray(trainingData.faq) ? trainingData.faq : [],
          syllabus: Array.isArray(trainingData.syllabus) ? trainingData.syllabus : [],
          tags: Array.isArray(trainingData.tags) ? trainingData.tags : [],
          instructors: Array.isArray(trainingData.instructors) ? trainingData.instructors : [],
          prerequisites: Array.isArray(trainingData.prerequisites) ? trainingData.prerequisites : [],
          objectives: Array.isArray(trainingData.objectives) ? trainingData.objectives : [],
        });
      }
    } else {
      setError(errorCodes.training.maintenance);
    }

    if (graduatesResult.status === "fulfilled") {
      setTraining((prevTraining) => ({
        ...prevTraining,
        graduates: Array.isArray(graduatesResult.value?.content) ? graduatesResult.value.content : [],
      }));
    } else {
      setError(graduatesResult.reason);
    }
    setLoading(false);
  }, [trainingKey]);

  useEffect(() => {
    fetchTraining();
  }, [fetchTraining, trainingKey]);

  return (
    <TrainingContext.Provider value={{ training, loading, error }}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining must be used within a TrainingProvider");
  }
  return context;
};
