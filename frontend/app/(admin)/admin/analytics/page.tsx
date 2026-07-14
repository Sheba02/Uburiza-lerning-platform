"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Users, BookOpen, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await api.get("/api/admin/analytics")).data,
  });

  const stats = [
    { label: "Total Learners", value: data?.totalLearners ?? "—", icon: <Users className="text-indigo-600" />, bg: "bg-indigo-50" },
    { label: "Total Enrollments", value: data?.totalEnrollments ?? "—", icon: <BookOpen className="text-green-600" />, bg: "bg-green-50" },
    { label: "Completion Rate", value: data?.completionRate ?? "—", icon: <TrendingUp className="text-yellow-600" />, bg: "bg-yellow-50" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Analytics</h2>
      <p className="text-gray-500 mb-6">Platform performance overview</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`${s.bg} p-3 rounded-lg`}>{s.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{isLoading ? "..." : s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
