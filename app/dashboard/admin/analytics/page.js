"use client";

import { useEffect, useState } from "react";
import { Users, Scale, Handshake, DollarSign } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { apiFetch } from "../../../../lib/api";
import RoleRoute from "../../../../components/RoleRoute";
import DashboardSidebar from "../../../../components/DashboardSidebar";
import Loader from "../../../../components/Loader";

function AnalyticsContent() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!token) return;
    apiFetch("/admin/analytics", { token }).then(setStats).catch(() => setStats(null));
  }, [token]);

  const cards = stats ? [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Total Lawyers", value: stats.totalLawyers, icon: Scale },
    { label: "Total Hires", value: stats.totalHires, icon: Handshake },
    { label: "Total Revenue", value: `$${stats.totalRevenue}`, icon: DollarSign },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar />
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-serif">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform overview at a glance.</p>

        {!stats ? <Loader /> : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {cards.map((c) => (
              <div key={c.label} className="bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-2xl p-5 text-center card-shadow">
                <div className="w-10 h-10 rounded-xl bg-navy-50 dark:bg-white/10 flex items-center justify-center text-navy-700 dark:text-navy-200 mx-auto mb-2"><c.icon size={18} /></div>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{c.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Analytics() {
  return <RoleRoute allow={["admin"]}><AnalyticsContent /></RoleRoute>;
}
