"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { apiFetch } from "../../lib/api";
import LawyerCard from "../../components/LawyerCard";
import Loader from "../../components/Loader";

const specializations = ["", "Family Law", "Corporate Law", "Criminal Law", "Property Law", "Tax Law", "Immigration Law"];

function BrowseLawyersContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [specialization, setSpecialization] = useState(searchParams.get("specialization") || "");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (specialization) params.set("specialization", specialization);
    if (minFee) params.set("minFee", minFee);
    if (maxFee) params.set("maxFee", maxFee);
    params.set("page", page);
    params.set("limit", 9);

    apiFetch(`/lawyers?${params.toString()}`)
      .then(setData)
      .catch(() => setData({ items: [], total: 0, pages: 1 }))
      .finally(() => setLoading(false));
  }, [search, specialization, minFee, maxFee, page]);

  useEffect(() => {
    const timer = setTimeout(load, 350);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => setPage(1), [search, specialization, minFee, maxFee]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-serif">Browse Lawyers</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find the right legal expert for your case.</p>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-navy-200 dark:border-white/10 bg-white dark:bg-[#131d35] text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-200" />
        </div>
        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-navy-200 dark:border-white/10 bg-white dark:bg-[#131d35] text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-200">
          <option value="">All specializations</option>
          {specializations.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="number" value={minFee} onChange={(e) => setMinFee(e.target.value)} placeholder="Min fee"
          className="w-24 px-3 py-2.5 rounded-lg border border-navy-200 dark:border-white/10 bg-white dark:bg-[#131d35] text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-200" />
        <input type="number" value={maxFee} onChange={(e) => setMaxFee(e.target.value)} placeholder="Max fee"
          className="w-24 px-3 py-2.5 rounded-lg border border-navy-200 dark:border-white/10 bg-white dark:bg-[#131d35] text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-200" />
      </div>

      <div className="mt-8">
        {loading ? <Loader label="Loading lawyers..." /> : data.items.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No lawyers found matching your filters.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.items.map((l, i) => <LawyerCard key={l._id} lawyer={l} index={i} />)}
            </div>
            {data.pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="w-9 h-9 rounded-lg border border-navy-200 dark:border-white/10 flex items-center justify-center disabled:opacity-40 text-gray-600 dark:text-gray-300"><ChevronLeft size={16} /></button>
                <span className="text-sm text-gray-600 dark:text-gray-300">Page {data.page} of {data.pages}</span>
                <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="w-9 h-9 rounded-lg border border-navy-200 dark:border-white/10 flex items-center justify-center disabled:opacity-40 text-gray-600 dark:text-gray-300"><ChevronRight size={16} /></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BrowseLawyers() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowseLawyersContent />
    </Suspense>
  );
}
