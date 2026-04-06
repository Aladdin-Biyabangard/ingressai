export const convertWeekToHour = (week, hoursPerSession, sessionsPerWeek) => {
  return week * hoursPerSession * sessionsPerWeek;
};
