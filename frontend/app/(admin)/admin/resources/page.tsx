"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Resource } from "@/types";
import { Plus, Trash2, FileText } from "lucide-react";
import { useState } from "react";

export default function AdminResourcesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", fileUrl: "", fileType: "pdf" });

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["resources"],
    queryFn: async () => (await api.get("/api/resources")).data,
  });

  const create = useMutation({
    mutationFn: () => api.post("/api/resources", form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["resources"] }); setShowForm(false); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/resources/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Resources</h2>
          <p className="text-gray-500">Manage learning materials</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> Add Resource
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Add Resource</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["title", "category", "fileUrl"] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <input
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
              <select
                value={form.fileType}
                onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {["pdf", "docx", "pptx", "xlsx", "mp4", "zip"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => create.mutate()}
              disabled={create.isPending}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {create.isPending ? "Adding..." : "Add"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {isLoading && <p className="text-center py-8 text-gray-400">Loading...</p>}
        {resources?.map((r) => (
          <div key={r.id} className="flex items-center gap-4 px-5 py-4">
            <FileText size={20} className="text-indigo-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{r.title}</p>
              <p className="text-xs text-gray-400">{r.category} · {r.fileType.toUpperCase()}</p>
            </div>
            <button onClick={() => remove.mutate(r.id)} className="text-red-400 hover:text-red-600 transition">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {!isLoading && resources?.length === 0 && (
          <p className="text-center py-12 text-gray-400">No resources yet.</p>
        )}
      </div>
    </div>
  );
}
