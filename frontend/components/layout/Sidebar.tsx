"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Award, Library, Users, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const learnerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/resources", label: "Resources", icon: Library },
  { href: "/certificates", label: "Certificates", icon: Award },
];

const adminLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/learners", label: "Learners", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/resources", label: "Resources", icon: Library },
];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const links = role === "ADMIN" ? adminLinks : learnerLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-700">Uburiza Learn</h1>
        <p className="text-xs text-gray-400 mt-0.5">by Uburiza Solutions</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
              pathname === href
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
