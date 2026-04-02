import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: number;
  title: string;
  category: string;
  progress: number;
  lessons: number;
  duration: string;
  image: string;
}

const CourseCard = ({ course, index }: { course: Course; index: number }) => {
  return (
    <div
      className="group bg-card rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card top with emoji & gradient */}
      <div className="h-32 gradient-primary flex items-center justify-center relative">
        <span className="text-5xl">{course.image}</span>
        <Badge className="absolute top-3 right-3 bg-primary-foreground/20 text-primary-foreground border-0 backdrop-blur-sm text-xs">
          {course.category}
        </Badge>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-base mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.lessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/btn">
          {course.progress > 0 ? "Continue Learning" : "Start Course"}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
