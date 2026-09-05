"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, X, Plus } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { apiFetch } from "../../../../lib/api";
import RoleRoute from "../../../../components/RoleRoute";
import DashboardSidebar from "../../../../components/DashboardSidebar";
import Loader from "../../../../components/Loader";

const specializations = ["Family Law", "Corporate Law", "Criminal Law", "Property Law", "Tax Law", "Immigration Law"];
const emptyForm = { name: "", bio: "", specialization: specializations[0], hourlyFee: "", location: "", status: "available" };
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

function ManageLegalProfileContent() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiFetch("/my-lawyer-profile", { token }).then(setListings).catch(() => setListings([])).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { if (token) load(); }, [token, load]);

  const uploadPhoto = async () => {
    if (!photoFile) return editingId ? undefined : "";
    const formData = new FormData();
    formData.append("image", photoFile);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.display_url;
  };

  const openNew = () => { setForm(emptyForm); setEditingId(null); setPhotoFile(null); setShowForm(true); };
  const openEdit = (l) => { setForm(l); setEditingId(l._id); setPhotoFile(null); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const photo = await uploadPhoto();
      const payload = { ...form, ...(photo !== undefined ? { photo } : {}) };
      if (editingId) {
        await apiFetch(`/lawyers/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        toast.success("Profile updated!");
      } else {
        await apiFetch("/lawyers", { method: "POST", token, body: JSON.stringify(payload) });
        toast.success("Legal profile created!");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to save profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/lawyers/${deleteTarget._id}`, { method: "DELETE", token });
      toast.success("Listing deleted.");
      setListings((prev) => prev.filter((l) => l._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete listing.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-serif">Manage Legal Profile</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your public listing(s) on LegalEase.</p>
          </div>
          <button onClick={openNew} className="btn-press flex items-center gap-1.5 bg-navy-700 hover:bg-navy-800 text-white text-sm font-semibold px-4 py-2 rounded-lg"><Plus size={15} /> New Listing</button>
        </div>

        {loading ? <Loader /> : listings.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">You haven&apos;t created a legal profile yet.</p>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {listings.map((l) => (
              <div key={l._id} className="bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-2xl p-4 card-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white">{l.name}</h3>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-50 dark:hover:bg-white/10"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(l)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-xs text-gold-600 font-semibold mt-1">{l.specialization}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">${l.hourlyFee}/hr &middot; {l.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#131d35] rounded-2xl p-6 w-full max-w-md relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X size={18} /></button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editingId ? "Update" : "New"} Legal Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input required placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100" />
              <textarea required placeholder="Short bio" rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} className="border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 resize-none" />
              <select value={form.specialization} onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))} className="border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100">
                {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input required type="number" placeholder="Hourly fee ($)" value={form.hourlyFee} onChange={(e) => setForm((f) => ({ ...f, hourlyFee: e.target.value }))} className="border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100" />
              <input required placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100" />
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100">
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="w-full mt-1 text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:bg-navy-50 dark:file:bg-white/10 file:text-navy-700 dark:file:text-navy-200 file:text-xs file:font-semibold" />
              </div>
              <button type="submit" disabled={submitting} className="btn-press bg-navy-700 hover:bg-navy-800 text-white rounded-lg py-2.5 text-sm font-semibold mt-1 disabled:opacity-60">
                {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Listing"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#131d35] rounded-2xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Delete {deleteTarget.name}?</h2>
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

export default function ManageLegalProfile() {
  return <RoleRoute allow={["lawyer"]}><ManageLegalProfileContent /></RoleRoute>;
}
