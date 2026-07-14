"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Course } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function AdminCoursesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", level: "BEGINNER", isFree: true, price: "" });

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["admin-courses"],
    queryFn: async () => (await api.get("/api/courses")).data,
  });

  const create = useMutation({
    mutationFn: () => api.post("/api/courses", { ...form, price: form.price ? Number(form.price) : null, published: true }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-courses"] }); setShowForm(false); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/courses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-courses"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
          <p className="text-gray-500">Manage all courses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> New Course
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Create Course</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["title", "description", "category"] as const).map((field) => (
              <div key={field} className={field === "description" ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <input
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} />
                Free course
              </label>
              {!form.isFree && (
                <input
                  type="number"
                  placeholder="Price (RWF)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => create.mutate()}
              disabled={create.isPending}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {create.isPending ? "Creating..." : "Create"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Title</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Level</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Price</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>}
            {courses?.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{c.title}</td>
                <td className="px-5 py-3 text-gray-500">{c.category}</td>
                <td className="px-5 py-3 text-gray-500">{c.level}</td>
                <td className="px-5 py-3 text-gray-500">{c.isFree ? "Free" : `RWF ${c.price?.toLocaleString()}`}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove.mutate(c.id)} className="text-red-400 hover:text-red-600 transition">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
