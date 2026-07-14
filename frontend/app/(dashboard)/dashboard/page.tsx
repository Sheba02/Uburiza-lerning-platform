import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { BookOpen, Award, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Welcome back, {session?.user.name} 👋
      </h2>
      <p className="text-gray-500 mb-8">Here&apos;s what&apos;s happening with your learning.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<BookOpen className="text-indigo-600" />} label="Enrolled Courses" value="—" bg="bg-indigo-50" />
        <StatCard icon={<TrendingUp className="text-green-600" />} label="In Progress" value="—" bg="bg-green-50" />
        <StatCard icon={<Award className="text-yellow-600" />} label="Certificates" value="—" bg="bg-yellow-50" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Continue Learning</h3>
        <p className="text-gray-400 text-sm">Your enrolled courses will appear here.</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`${bg} p-3 rounded-lg`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
