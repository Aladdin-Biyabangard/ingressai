export const filterValidSections = (training, array) => {
  return array.filter(({ key }) => {
    switch (key) {
      case "advantages":
        return training?.advantages?.length > 0;
      case "trainingProgram":
        return training?.syllabus?.length > 0;
      case "upcomingGroups":
        return training?.upcomingSessions?.length > 0;
      case "graduatesHere":
        return training?.graduates?.length > 0;
      case "companies":
      case "whereDoOurGraduatesWork":
        return training?.graduatesWorkplaces?.length > 0;
      case "instructors":
        return training?.instructors?.length > 0;
      case "trainingApplicationForm":
        return true;
      case "relatedCourses":
        return training?.relatedCourses?.length > 0;
      case "faq":
        return training?.faq?.length > 0;
      case "rolesAndResponsibilities":
        return Object.keys(training?.rolesAndResponsibilities).length > 0;
      case "prerequisites":
        return training?.prerequisites?.length > 0;
      case "skillsYouWillGain":
        return training?.skillsYouWillGain?.length > 0;
      case "recommendedAdditionalTrainings":
        return true;
      case "trainingRoadmap":
        return true;
      default:
        return false;
    }
  });
};

export const filterValidVacancySections = (vacancy, array) => {
  return array.filter(({ key }) => {
    switch (key) {
      case "description":
        return vacancy?.description && vacancy.description.trim().length > 0;
      case "requirements":
        return vacancy?.requirements && vacancy.requirements.trim().length > 0;
      default:
        return false;
    }
  });
};
