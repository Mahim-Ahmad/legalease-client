"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Inbox, Check, X } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { apiFetch } from "../../../../lib/api";
import RoleRoute from "../../../../components/RoleRoute";
import DashboardSidebar from "../../../../components/DashboardSidebar";
import Loader from "../../../../components/Loader";

function MyCommentsContent() {
  const { token } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiFetch("/my-comments", { token }).then(setComments).catch(() => setComments([])).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { if (token) load(); }, [token, load]);

  const startEdit = (c) => { setEditingId(c._id); setEditText(c.text); };

  const saveEdit = async (id) => {
    try {
      await apiFetch(`/comments/${id}`, { method: "PATCH", token, body: JSON.stringify({ text: editText }) });
      setComments((prev) => prev.map((c) => (c._id === id ? { ...c, text: editText } : c)));
      setEditingId(null);
      toast.success("Comment updated.");
    } catch (err) {
      toast.error(err.message || "Failed to update comment.");
    }
  };

  const deleteComment = async (id) => {
    try {
      await apiFetch(`/comments/${id}`, { method: "DELETE", token });
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success("Comment deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete comment.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar />
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-serif">My Comments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comments you've left on lawyer profiles.</p>

        {loading ? <Loader /> : comments.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><Inbox size={32} className="mx-auto mb-3" /><p className="text-sm">You haven&apos;t posted any comments yet.</p></div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {comments.map((c) => (
              <div key={c._id} className="bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-2xl p-4 card-shadow">
                {editingId === c._id ? (
                  <div className="flex items-center gap-2">
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1 border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-100" />
                    <button onClick={() => saveEdit(c._id)} className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-700 dark:text-gray-200">{c.text}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-50 dark:hover:bg-white/10"><Pencil size={14} /></button>
                      <button onClick={() => deleteComment(c._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyComments() {
  return <RoleRoute allow={["user"]}><MyCommentsContent /></RoleRoute>;
}
