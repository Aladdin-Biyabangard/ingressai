"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";

import { getHomeData } from "@/lib/utils/api/home";
import { getComments } from "@/lib/utils/api/comments";
import { getEvents } from "@/lib/utils/api/events";
import { filterByCategory } from "@/lib/utils/helpers";
import { errorCodes, errorResponses } from "@/lib/constants/errorCodes";

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useParams()

  const hasFetched = useRef(false);

  const [data, setData] = useState({
    instructors: [],
    courses: [],
    categories: [],
    customers: [],
    filteredCourses: [],
    comments: {},
    totalCourses: 0,
    totalInstructors: 0,
    organization: {},
    events: [],
  });

  const [loading, setLoading] = useState({
    home: true,
    comments: true,
    events: true,
  });

  const [error, setError] = useState({
    home: null,
    comments: null,
    events: null,
  });

  const urlType = searchParams.get("type") || "";
  const urlCategory = searchParams.get("category") || "";

  const [filter, setFilter] = useState({
    type: urlType,
    category: urlCategory,
  });

  const [selectedCategoryForExplore, setSelectedCategoryForExplore] = useState(
    {}
  );

  const filteredExploreCourses = useMemo(() => {
    let filtered = [...data?.courses];

    filtered = filterByCategory(filtered, selectedCategoryForExplore.id);

    return filtered;
  }, [data.courses, selectedCategoryForExplore.id]);

  const updateFilter = useCallback(
    (key, value) => {
      const updatedFilter = { ...filter, [key]: value };

      const params = new URLSearchParams(searchParams.toString());

      if (key === "type") {
        value ? params.set("type", value) : params.delete("type");
      }

      if (key === "category") {
        value ? params.set("category", value) : params.delete("category");
      }

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });

      setFilter(updatedFilter);
    },
    [filter.type, filter.category, pathname, router, searchParams]
  );

  const fetchAllData = useCallback(async () => {
    const [homeResult, commentsResult, eventsResult] = await Promise.allSettled(
      [getHomeData(locale), getComments(), getEvents({ page: 0, size: 3 })]
    );

    if (homeResult.status === "fulfilled") {
      const homeData = homeResult.value;
      if (errorResponses[homeData]) {
        setError((prev) => ({ ...prev, home: homeData }));
      } else {
        setData((prevData) => ({
          ...prevData,
          ...homeData,
          totalCourses: homeData?.courses?.length || 0,
          totalInstructors: homeData?.instructors?.length || 0,
        }));

        hasFetched.current = true;
        setError((prev) => ({ ...prev, home: null }));
      }
    } else {
      setError((prev) => ({ ...prev, home: errorCodes.home.maintenance }));
    }

    if (commentsResult.status === "fulfilled" && commentsResult.value) {
      setData((prevData) => ({
        ...prevData,
        comments: commentsResult.value,
      }));
      setError((prev) => ({ ...prev, comments: null }));
    } else {
      setError((prev) => ({
        ...prev,
        comments: commentsResult.reason.message,
      }));
    }

    if (eventsResult.status === "fulfilled" && eventsResult.value) {
      setData((prevData) => ({
        ...prevData,
        events: eventsResult.value?.content,
      }));
      setError((prev) => ({ ...prev, events: null }));
    } else {
      setError((prev) => ({
        ...prev,
        events: eventsResult.reason.message,
      }));
    }

    setLoading({ home: false, comments: false, events: false });
  }, []);

  const filteredCourses = useMemo(() => {
    if (!data.courses.length) return [];

    const { type, category } = filter;

    let filtered = [...data.courses];

    filtered = filterByCategory(filtered, category);

    return filtered;
  }, [data.courses, filter.type, filter.category]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      filteredCourses,
    }));
  }, [filteredCourses]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAllData();
    }
  }, [fetchAllData]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      filteredExploreCourses,
    }));
  }, [filteredExploreCourses]);

  useEffect(() => {
    setFilter({
      type: urlType,
      category: urlCategory,
    });
  }, [urlType, urlCategory]);

  const contextValue = useMemo(
    () => ({
      data,
      loading,
      error,
      filter,
      updateFilter,
      fetchAllData,
      selectedCategoryForExplore,
      setSelectedCategoryForExplore,
    }),
    [data, loading, error, filter, updateFilter, fetchAllData]
  );

  return (
    <GlobalDataContext.Provider value={contextValue}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => {
  const context = useContext(GlobalDataContext);
  if (!context)
    throw new Error("useGlobalData must be used within HomeProvider");
  return context;
};
