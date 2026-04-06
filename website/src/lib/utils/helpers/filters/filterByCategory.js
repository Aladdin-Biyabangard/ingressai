export const filterByCategory = (courses, category) => {
  if (!category) return courses;
  return courses.filter((course) =>
    course.categories?.some((c) => c?.categoryId === category)
  );
};
