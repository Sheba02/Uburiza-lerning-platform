"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Resource } from "@/types";
import { FileText, Download } from "lucide-react";

export default function ResourcesPage() {
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["resources"],
    queryFn: async () => (await api.get("/api/resources")).data,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Resource Library</h2>
      <p className="text-gray-500 mb-6">Download learning materials</p>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-16 animate-pulse" />
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {resources?.map((r) => (
          <div key={r.id} className="flex items-center gap-4 px-5 py-4">
            <FileText size={20} className="text-indigo-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{r.title}</p>
              <p className="text-xs text-gray-400">{r.category} · {r.fileType.toUpperCase()}</p>
            </div>
            <a
              href={r.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition"
            >
              <Download size={14} />
              Download
            </a>
          </div>
        ))}
        {!isLoading && resources?.length === 0 && (
          <p className="text-gray-400 text-center py-12">No resources available yet.</p>
        )}
      </div>
    </div>
  );
}
