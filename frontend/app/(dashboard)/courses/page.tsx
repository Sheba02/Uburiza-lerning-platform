import CourseGrid from "@/components/courses/CourseGrid";

export default function CoursesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Browse Courses</h2>
      <p className="text-gray-500 mb-6">Explore all available courses</p>
      <CourseGrid />
    </div>
  );
}
