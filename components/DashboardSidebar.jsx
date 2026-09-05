"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const menus = {
  user: [
    { href: "/dashboard/user/hiring-history", label: "Hiring History" },
    { href: "/dashboard/user/comments", label: "My Comments" },
    { href: "/dashboard/user/update-profile", label: "Update Profile" },
  ],
  lawyer: [
    { href: "/dashboard/lawyer/hiring-history", label: "Hiring Requests" },
    { href: "/dashboard/lawyer/manage-legal-profile", label: "Manage Profile" },
  ],
  admin: [
    { href: "/dashboard/admin/manage-users", label: "Manage Users" },
    { href: "/dashboard/admin/all-transactions", label: "Transactions" },
    { href: "/dashboard/admin/analytics", label: "Analytics" },
  ],
};

export default function DashboardSidebar() {
  const { role } = useAuth();
  const pathname = usePathname();
  const items = menus[role] || [];

  return (
    <aside className="w-full md:w-56 shrink-0">
      <div className="bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-2xl p-3 flex md:flex-col gap-1.5 overflow-x-auto">
        <p className="hidden md:block px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">{role} Dashboard</p>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === item.href ? "bg-navy-700 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-navy-50 dark:hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
