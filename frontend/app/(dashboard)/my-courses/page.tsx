"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function MyCoursesPage() {
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["my-courses"],
    queryFn: async () => (await api.get("/api/my-courses")).data,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">My Courses</h2>
      <p className="text-gray-500 mb-6">Track your learning progress</p>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-32 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && enrollments?.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">You haven&apos;t enrolled in any courses yet.</p>
          <Link href="/courses" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
            Browse Courses
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrollments?.map((e: any) => {
          const lessons = e.course.modules?.flatMap((m: any) => m.lessons) ?? [];
          const completed = lessons.filter((l: any) => l.progress?.[0]?.completed).length;
          const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;

          return (
            <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-1">{e.course.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{e.course.category} · {e.course.level}</p>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-4">
                <span>{completed}/{lessons.length} lessons</span>
                <span>{pct}%</span>
              </div>
              <Link
                href={`/courses/${e.course.id}`}
                className="text-sm bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-lg hover:bg-indigo-100 transition"
              >
                Continue →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
