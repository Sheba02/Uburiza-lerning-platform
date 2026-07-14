"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Course } from "@/types";
import CourseCard from "./CourseCard";
import { useState } from "react";

const LEVELS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function CourseGrid() {
  const [level, setLevel] = useState("ALL");

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["courses", level],
    queryFn: async () => {
      const params = level !== "ALL" ? { level } : {};
      const res = await api.get("/api/courses", { params });
      return res.data;
    },
  });

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              level === l ? "bg-indigo-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-64 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && courses?.length === 0 && (
        <p className="text-gray-400 text-center py-16">No courses found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </div>
  );
}
