"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Course } from "@/types";
import { BookOpen, Clock, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CourseDetail({ courseId }: { courseId: string }) {
  const qc = useQueryClient();
  const [accessCode, setAccessCode] = useState("");
  const [enrolled, setEnrolled] = useState(false);

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => (await api.get(`/api/courses/${courseId}`)).data,
  });

  const enroll = useMutation({
    mutationFn: () => api.post("/api/enroll", { courseId, accessCode: accessCode || undefined }),
    onSuccess: () => { setEnrolled(true); qc.invalidateQueries({ queryKey: ["my-courses"] }); },
  });

  if (isLoading) return <div className="animate-pulse h-96 bg-white rounded-xl" />;
  if (!course) return <p className="text-gray-400">Course not found.</p>;

  const totalLessons = course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {course.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-2">{course.title}</h1>
            <p className="text-gray-500 mb-4">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><BookOpen size={14} /> {totalLessons} lessons</span>
              <span>{course.level}</span>
            </div>
          </div>
          <div className="text-right min-w-[160px]">
            <p className="text-2xl font-bold text-indigo-600 mb-3">
              {course.isFree ? "Free" : `RWF ${course.price?.toLocaleString()}`}
            </p>
            {!course.isFree && !enrolled && (
              <input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Access code"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
            <button
              onClick={() => enroll.mutate()}
              disabled={enroll.isPending || enrolled}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {enrolled ? "Enrolled ✓" : enroll.isPending ? "Enrolling..." : "Enroll Now"}
            </button>
            {enroll.isError && <p className="text-red-500 text-xs mt-1">Enrollment failed</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Course Content</h2>
        <div className="space-y-3">
          {course.modules?.map((mod) => (
            <details key={mod.id} className="border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer font-medium text-gray-700">
                {mod.title}
                <span className="text-xs text-gray-400">{mod.lessons.length} lessons</span>
              </summary>
              <ul className="border-t border-gray-100 divide-y divide-gray-100">
                {mod.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600">
                    <Clock size={14} className="text-gray-400" />
                    {lesson.title}
                    <span className="ml-auto text-xs text-gray-400">{lesson.type}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
