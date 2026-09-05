"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Inbox, Check, X } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { apiFetch } from "../../../../lib/api";
import RoleRoute from "../../../../components/RoleRoute";
import DashboardSidebar from "../../../../components/DashboardSidebar";
import Loader from "../../../../components/Loader";

const statusStyle = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
  accepted: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
  rejected: "bg-red-50 text-red-600 dark:bg-red-500/10",
};

function LawyerHiringHistoryContent() {
  const { token } = useAuth();
  const [hirings, setHirings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiFetch("/lawyer-hirings", { token }).then(setHirings).catch(() => setHirings([])).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { if (token) load(); }, [token, load]);

  const respond = async (id, status) => {
    try {
      await apiFetch(`/hirings/${id}/status`, { method: "PATCH", token, body: JSON.stringify({ status }) });
      setHirings((prev) => prev.map((h) => (h._id === id ? { ...h, status } : h)));
      toast.success(`Request ${status}.`);
    } catch (err) {
      toast.error(err.message || "Failed to update request.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar />
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-serif">Hiring Requests</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Clients who want to hire you.</p>

        {loading ? <Loader /> : hirings.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><Inbox size={32} className="mx-auto mb-3" /><p className="text-sm">No hiring requests yet.</p></div>
        ) : (
          <div className="mt-6 overflow-x-auto bg-white dark:bg-[#131d35] rounded-2xl border border-navy-100 dark:border-white/10 card-shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-navy-100 dark:border-white/10">
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {hirings.map((h) => (
                  <tr key={h._id} className="border-b border-navy-50 dark:border-white/5 last:border-0">
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">{h.clientName || h.clientEmail}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{new Date(h.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[h.status]}`}>{h.status}</span></td>
                    <td className="px-4 py-3">
                      {h.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => respond(h._id, "accepted")} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"><Check size={15} /></button>
                          <button onClick={() => respond(h._id, "rejected")} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><X size={15} /></button>
                        </div>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LawyerHiringHistory() {
  return <RoleRoute allow={["lawyer"]}><LawyerHiringHistoryContent /></RoleRoute>;
}
