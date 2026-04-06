export const COURSE_SLIDER_STYLES = {
  ourCourses: {
  className: "ourCourses",
    slidesPerView: 4,
    maxWidth: "292px",
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  },
  relatedCourses: {
    className: "relatedCourses",
    slidesPerView: 3,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 2,
      },
      768: {
        slidersPerView: 1,
      },
      1024: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  },
};
