import dynamic from "next/dynamic";

const Advantages = dynamic(
  () => import("@/components/ui/training/advantages/Advantages"),
  { ssr: false, loading: () => null }
);
const Companies = dynamic(
  () => import("@/components/ui/training/companies/Companies"),
  { ssr: false, loading: () => null }
);
const Faq = dynamic(() => import("@/components/ui/training/faq/Faq"), {
  ssr: false,
  loading: () => null,
});
const Graduates = dynamic(
  () => import("@/components/ui/training/graduates/Graduates"),
  { ssr: false, loading: () => null }
);
const Instructors = dynamic(
  () => import("@/components/ui/training/instructors/Instructors"),
  { ssr: false, loading: () => null }
);
const NextGroups = dynamic(
  () => import("@/components/ui/training/next-groups/NextGroups"),
  { ssr: false, loading: () => null }
);
const RelatedCourses = dynamic(
  () => import("@/components/ui/training/related-courses/RelatedCourses"),
  { ssr: false, loading: () => null }
);
const Syllabus = dynamic(
  () => import("@/components/ui/training/syllabus/Syllabus"),
  { ssr: false, loading: () => null }
);

const RolesResponsibilities = dynamic(
  () =>
    import(
      "@/components/ui/roadmap/roles-responsibilities/RolesResponsibilities"
    ),
  { ssr: false, loading: () => null }
);

const SkillsRequired = dynamic(
  () => import("@/components/ui/roadmap/skills-required/SkillsRequired"),
  {
    ssr: false,
    loading: () => null,
  }
);

const Objectives = dynamic(
  () => import("@/components/ui/roadmap/objectives/Objectives"),
  {
    ssr: false,
    loading: () => null,
  }
);

const RecommendedAdditionalTrainings = dynamic(
  () =>
    import(
      "@/components/ui/roadmap/recommended-additional-trainings/RecommendedAdditionalTrainings"
    ),
  {
    ssr: false,
    loading: () => null,
  }
);

const TrainingRoadmap = dynamic(
  () => import("@/components/ui/roadmap/training-roadmap/TrainingRoadmap"),
  {
    ssr: false,
    loading: () => null,
  }
);

const VacancyDescription = dynamic(
  () => import("@/components/ui/vacancy/vacancy-description/VacancyDescription"),
  { ssr: false, loading: () => null }
);

export const defaultSectionForTraining = "advantages";
export const defaultSectionForVacancy = "description";

export const selectSectionsAsComponentForTraining = [
  {
    key: "advantages",
    component: Advantages,
  },
  {
    key: "prerequisites",
    component: SkillsRequired,
  },
  {
    key: "trainingObjectives",
    component: SkillsRequired,
  },
  {
    key: "trainingProgram",
    component: Syllabus,
  },
  {
    key: "upcomingGroups",
    component: NextGroups,
  },
  { key: "graduates", component: Graduates },
  { key: "companies", component: Companies },
  // // { key: "feedbacks", component: Comments },
  { key: "instructors", component: Instructors },
  // {
  //   key: "trainingApplicationForm",
  //   component: CourseApplicationForm,
  // },
  {
    key: "relatedCourses",
    component: RelatedCourses,
  },
  {
    key: "faq",
    component: Faq,
  },
];

export const selectSectionsAsComponentForRoadmap = [
  {
    key: "rolesAndResponsibilities",
    component: RolesResponsibilities,
  },
  {
    key: "prerequisites",
    component: SkillsRequired,
  },
  {
    key: "trainingRoadmap",
    component: TrainingRoadmap,
  },
  {
    key: "recommendedAdditionalTrainings",
    component: RecommendedAdditionalTrainings,
  },
  { key: "skillsYouWillGain", component: Objectives },
  {
    key: "whereDoOurGraduatesWork",
    component: Companies,
  },
  {
    key: "graduatesHere",
    component: Instructors,
  },
  // {
  //   key: "trainingApplicationForm",
  //   component: CourseApplicationForm,
  // },
  { key: "faq", component: Faq },
];

export const selectSectionsAsComponentForVacancy = [
  {
    key: "description",
    component: VacancyDescription,
  },
  {
    key: "requirements",
    component: VacancyDescription,
  },
];

export const defaultSectionForRoadmap = "roles&responsibilities";
