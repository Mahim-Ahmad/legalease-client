"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MapPin, DollarSign, Calendar, ArrowLeft, MessageSquare, Send } from "lucide-react";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../../../components/Loader";

export default function LawyerDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hireModal, setHireModal] = useState(false);
  const [hiring, setHiring] = useState(false);
  const [comments, setComments] = useState([]);
  const [canComment, setCanComment] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    apiFetch(`/lawyers/${id}`).then(setLawyer).catch(() => setLawyer(null)).finally(() => setLoading(false));
    apiFetch(`/comments/${id}`).then(setComments).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!token) return;
    apiFetch(`/hirings/check?lawyerId=${id}`, { token }).then((d) => setCanComment(d.hasHired)).catch(() => {});
  }, [id, token]);

  if (loading) return <Loader label="Loading lawyer profile..." />;
  if (!lawyer) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">Lawyer not found.</p>
        <Link href="/lawyers" className="text-navy-600 underline mt-2 inline-block">Back to Browse Lawyers</Link>
      </div>
    );
  }

  const handleHire = async () => {
    setHiring(true);
    try {
      await apiFetch("/hirings", { method: "POST", token, body: JSON.stringify({ lawyerId: id }) });
      toast.success("Hiring request sent! Waiting for the lawyer to accept.");
      setHireModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to send hiring request.");
    } finally {
      setHiring(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const result = await apiFetch("/comments", { method: "POST", token, body: JSON.stringify({ lawyerId: id, text: commentText }) });
      setComments((prev) => [{ _id: result.insertedId, text: commentText, authorName: user.displayName || user.email, createdAt: new Date() }, ...prev]);
      setCommentText("");
      toast.success("Comment posted!");
    } catch (err) {
      toast.error(err.message || "Failed to post comment.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/lawyers" className="inline-flex items-center gap-1 text-sm text-navy-700 dark:text-navy-200 hover:underline mb-6">
        <ArrowLeft size={15} /> Back to Browse Lawyers
      </Link>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-2xl card-shadow p-6 text-center h-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lawyer.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(lawyer.name)}`} alt={lawyer.name} className="w-24 h-24 rounded-full object-cover mx-auto" />
          <h1 className="mt-3 font-bold text-gray-900 dark:text-white">{lawyer.name}</h1>
          <p className="text-xs text-gold-600 font-semibold mt-1">{lawyer.specialization}</p>
          <p className="text-xl font-extrabold text-navy-700 dark:text-navy-200 mt-3">${lawyer.hourlyFee}/hr</p>
          <p className="text-xs text-gray-400 mt-1 capitalize">{lawyer.status || "available"}</p>

          {user ? (
            <button onClick={() => setHireModal(true)} className="btn-press w-full mt-4 bg-navy-700 hover:bg-navy-800 text-white font-semibold py-2.5 rounded-lg transition-colors">
              Hire This Lawyer
            </button>
          ) : (
            <Link href={`/login?from=/lawyers/${id}`} className="block mt-4 bg-navy-700 hover:bg-navy-800 text-white font-semibold py-2.5 rounded-lg transition-colors">
              Login to Hire
            </Link>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="flex flex-col gap-5">
          <div className="bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-2xl card-shadow p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-2">About</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{lawyer.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-4">
              {lawyer.location && <span className="flex items-center gap-1.5"><MapPin size={15} /> {lawyer.location}</span>}
              <span className="flex items-center gap-1.5"><Calendar size={15} /> Joined {new Date(lawyer.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><DollarSign size={15} /> ${lawyer.hourlyFee}/hr</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-2xl card-shadow p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><MessageSquare size={16} /> Client Comments</h2>

            {canComment && (
              <form onSubmit={handleComment} className="flex gap-2 mb-4">
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Share your experience..."
                  className="flex-1 border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-200" />
                <button type="submit" className="btn-press bg-navy-700 hover:bg-navy-800 text-white px-3.5 rounded-lg"><Send size={15} /></button>
              </form>
            )}
            {!canComment && user && <p className="text-xs text-gray-400 mb-4">Only clients who have hired this lawyer can comment.</p>}

            {comments.length === 0 ? (
              <p className="text-sm text-gray-400">No comments yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map((c) => (
                  <div key={c._id} className="border-b border-navy-50 dark:border-white/5 pb-3 last:border-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.authorName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {hireModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#131d35] rounded-2xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hire {lawyer.name}?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">A hiring request will be sent. You'll be able to pay once the lawyer accepts.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setHireModal(false)} className="flex-1 border border-navy-200 dark:border-white/10 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Cancel</button>
              <button onClick={handleHire} disabled={hiring} className="flex-1 bg-navy-700 hover:bg-navy-800 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-60">
                {hiring ? "Sending..." : "Confirm Hire"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
