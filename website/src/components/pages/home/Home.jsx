"use client";

import dynamic from "next/dynamic";

import GlobalDataWrapper from "@/components/shared/global-data-wrapper/GlobalDataWrapper";

const Details = dynamic(() => import("@/components/ui/home/details/Details"), {
  ssr: false,
});
const OurCourses = dynamic(
  () => import("@/components/ui/home/our-courses/OurCourses"),
  { ssr: false }
);
const WhyChooseUs = dynamic(
  () => import("@/components/ui/home/why-choose-us/WhyChooseUs"),
  { ssr: false }
);
const Instructors = dynamic(
  () => import("@/components/ui/home/instructors/Instructors"),
  { ssr: false }
);
const PracticePortal = dynamic(
  () => import("@/components/ui/home/practice-portal/PracticePortal"),
  { ssr: false }
);
const Comments = dynamic(
  () => import("@/components/ui/home/comments/Comments"),
  { ssr: false }
);
const CourseApplication = dynamic(
  () => import("@/components/shared/course-application/CourseApplication"),
  { ssr: false }
);
const Customers = dynamic(
  () => import("@/components/ui/home/customers/Customers"),
  {
    ssr: false,
  }
);
const Events = dynamic(() => import("@/components/shared/events/Events"), {
  ssr: false,
});

const Blogs = dynamic(() => import("@/components/ui/home/blogs/Blogs"), {
  ssr: false,
});

import { useGlobalData } from "@/contexts/GlobalDataContext";

import styles from "./home.module.css";

export default function Home() {
  const { data, filter, error, loading, updateFilter } = useGlobalData();

  return (
    <GlobalDataWrapper loading={loading.home} error={error.home}>
      <div className={styles.home}>
        <div className={styles.homeBackgroundContainer}>
          <Details
            loading={loading.home}
            error={error.home}
            details={data?.headlineDtos}
          />
          <OurCourses
            courses={data.filteredCourses}
            loading={loading.home}
            error={error.home}
            onChangeFilter={updateFilter}
            categories={data.categories}
            categoriesLoading={loading.home}
            categoriesError={error.home}
            filter={filter}
          />
        </div>
        <WhyChooseUs reasons={data?.reasons} />
        <Instructors
          instructors={data.instructors}
          loading={loading.home}
          error={error.home}
        />
        <PracticePortal />
        <Events
          events={data.events}
          loading={loading.home}
          error={error.home}
        />
        <Blogs />
        <Comments
          loading={loading.comments}
          error={error.comments}
          comments={data.comments?.result?.reviews}
        />
        <Customers
          customers={data.customers}
          loading={loading.home}
          error={error.home}
        />
        <CourseApplication courses={data.courses} formContinue={true} />
      </div>
    </GlobalDataWrapper>
  );
}
