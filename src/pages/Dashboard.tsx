import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CourseCard from "@/components/dashboard/CourseCard";
import StatsBar from "@/components/dashboard/StatsBar";
import ChatWidget from "@/components/chat/ChatWidget";

const courses = [
  {
    id: 1,
    title: "React & TypeScript Mastery",
    category: "Frontend",
    progress: 72,
    lessons: 24,
    duration: "12h 30m",
    image: "🚀",
  },
  {
    id: 2,
    title: "Node.js Backend Development",
    category: "Backend",
    progress: 45,
    lessons: 18,
    duration: "9h 15m",
    image: "⚙️",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    category: "Design",
    progress: 90,
    lessons: 16,
    duration: "8h 00m",
    image: "🎨",
  },
  {
    id: 4,
    title: "Python for Data Science",
    category: "Data",
    progress: 20,
    lessons: 30,
    duration: "15h 45m",
    image: "📊",
  },
  {
    id: 5,
    title: "Cloud Architecture with AWS",
    category: "DevOps",
    progress: 0,
    lessons: 22,
    duration: "11h 20m",
    image: "☁️",
  },
  {
    id: 6,
    title: "Mobile App with React Native",
    category: "Mobile",
    progress: 10,
    lessons: 20,
    duration: "10h 00m",
    image: "📱",
  },
];

const Dashboard = () => {
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", ...new Set(courses.map((c) => c.category))];
  const filtered = filter === "all" ? courses : courses.filter((c) => c.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsBar courses={courses} />

        {/* Filter chips */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat === "all" ? "All Courses" : cat}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default Dashboard;
