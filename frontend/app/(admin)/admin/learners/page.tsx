"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { User } from "@/types";
import { Download } from "lucide-react";

export default function LearnersPage() {
  const { data: learners, isLoading } = useQuery<User[]>({
    queryKey: ["admin-learners"],
    queryFn: async () => (await api.get("/api/admin/learners")).data,
  });

  const exportCSV = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/export/learners`, "_blank");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Learners</h2>
          <p className="text-gray-500">All registered learners</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr><td colSpan={3} className="text-center py-8 text-gray-400">Loading...</td></tr>
            )}
            {learners?.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{l.name}</td>
                <td className="px-5 py-3 text-gray-500">{l.email}</td>
                <td className="px-5 py-3 text-gray-400">{new Date(l.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!isLoading && learners?.length === 0 && (
              <tr><td colSpan={3} className="text-center py-8 text-gray-400">No learners yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
