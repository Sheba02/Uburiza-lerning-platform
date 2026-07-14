"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { Certificate } from "@/types";
import { Award } from "lucide-react";

export default function CertificatesPage() {
  const { data: session } = useSession();

  const { data: certificates, isLoading } = useQuery<Certificate[]>({
    queryKey: ["certificates"],
    enabled: !!session?.user.id,
    queryFn: async () => (await api.get(`/api/certificates/${session!.user.id}`)).data,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">My Certificates</h2>
      <p className="text-gray-500 mb-6">Certificates you&apos;ve earned</p>

      {isLoading && <div className="animate-pulse h-32 bg-white rounded-xl border border-gray-200" />}

      {!isLoading && certificates?.length === 0 && (
        <div className="text-center py-16">
          <Award size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No certificates yet. Complete a course to earn one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates?.map((cert) => (
          <div key={cert.id} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <Award size={40} className="text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">{cert.course?.title}</h3>
            <p className="text-xs text-gray-400 mb-4">
              Issued {new Date(cert.issuedAt).toLocaleDateString()}
            </p>
            <a
              href={`/api/certificate/${cert.certificateUid}`}
              target="_blank"
              className="text-sm text-indigo-600 hover:underline"
            >
              Verify Certificate →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
