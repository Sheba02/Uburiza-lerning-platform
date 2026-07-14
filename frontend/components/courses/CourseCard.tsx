import { Course } from "@/types";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const levelColors: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-yellow-100 text-yellow-700",
  ADVANCED: "bg-red-100 text-red-700",
};

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="h-40 bg-indigo-50 flex items-center justify-center">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen size={40} className="text-indigo-300" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[course.level]}`}>
            {course.level}
          </span>
          <span className="text-xs text-gray-400">{course.category}</span>
        </div>
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-indigo-600">
            {course.isFree ? "Free" : `RWF ${course.price?.toLocaleString()}`}
          </span>
          <Link
            href={`/courses/${course.id}`}
            className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
