"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";
import RoleRoute from "../../../../components/RoleRoute";
import DashboardSidebar from "../../../../components/DashboardSidebar";

function UpdateProfileContent() {
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.displayName || "", photoURL: user?.photoURL || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(form.name, form.photoURL);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar />
      <div className="flex-1 max-w-md">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-serif">Update Profile</h1>
        <div className="bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-2xl card-shadow p-6 mt-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={form.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=" + (form.name || user.email)} alt="" referrerPolicy="no-referrer" className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-navy-100 dark:ring-white/10" />
          <form onSubmit={handleSave} className="mt-5 flex flex-col gap-3 text-left">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full mt-1 border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Photo URL</label>
              <input value={form.photoURL} onChange={(e) => setForm((f) => ({ ...f, photoURL: e.target.value }))} className="w-full mt-1 border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100" />
            </div>
            <button type="submit" disabled={saving} className="btn-press bg-navy-700 hover:bg-navy-800 text-white rounded-lg py-2.5 text-sm font-semibold mt-1 disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function UpdateProfile() {
  return <RoleRoute allow={["user", "lawyer", "admin"]}><UpdateProfileContent /></RoleRoute>;
}
