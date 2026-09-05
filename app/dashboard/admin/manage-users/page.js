"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { apiFetch } from "../../../../lib/api";
import RoleRoute from "../../../../components/RoleRoute";
import DashboardSidebar from "../../../../components/DashboardSidebar";
import Loader from "../../../../components/Loader";

function ManageUsersContent() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiFetch("/users", { token }).then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { if (token) load(); }, [token, load]);

  const changeRole = async (id, role) => {
    try {
      await apiFetch(`/users/${id}/role`, { method: "PATCH", token, body: JSON.stringify({ role }) });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success("Role updated.");
    } catch (err) {
      toast.error(err.message || "Failed to update role.");
    }
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/users/${deleteTarget._id}`, { method: "DELETE", token });
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      toast.success("User deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar />
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-serif">Manage Users</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All registered users on LegalEase.</p>

        {loading ? <Loader /> : (
          <div className="mt-6 overflow-x-auto bg-white dark:bg-[#131d35] rounded-2xl border border-navy-100 dark:border-white/10 card-shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-navy-100 dark:border-white/10">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-navy-50 dark:border-white/5 last:border-0">
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">{u.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.email}</td>
                    <td className="px-4 py-3">
                      <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)} className="border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-2 py-1 text-xs text-gray-700 dark:text-gray-200">
                        <option value="user">User</option>
                        <option value="lawyer">Lawyer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDeleteTarget(u)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#131d35] rounded-2xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Delete {deleteTarget.email}?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 border border-navy-200 dark:border-white/10 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageUsers() {
  return <RoleRoute allow={["admin"]}><ManageUsersContent /></RoleRoute>;
}
