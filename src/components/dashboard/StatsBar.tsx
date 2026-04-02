import { BookOpen, Clock, Trophy, TrendingUp } from "lucide-react";

interface Course {
  id: number;
  progress: number;
  lessons: number;
  duration: string;
}

const StatsBar = ({ courses }: { courses: Course[] }) => {
  const totalCourses = courses.length;
  const inProgress = courses.filter((c) => c.progress > 0 && c.progress < 100).length;
  const completed = courses.filter((c) => c.progress === 100).length;
  const avgProgress = Math.round(courses.reduce((a, c) => a + c.progress, 0) / totalCourses);

  const stats = [
    { label: "Enrolled", value: totalCourses, icon: BookOpen, color: "text-primary" },
    { label: "In Progress", value: inProgress, icon: Clock, color: "text-warning" },
    { label: "Completed", value: completed, icon: Trophy, color: "text-success" },
    { label: "Avg Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
