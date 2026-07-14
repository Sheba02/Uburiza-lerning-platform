import CourseDetail from "@/components/courses/CourseDetail";

export default function CoursePage({ params }: { params: { id: string } }) {
  return <CourseDetail courseId={params.id} />;
}
