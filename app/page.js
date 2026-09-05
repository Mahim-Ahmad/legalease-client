"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "../lib/api";
import LawyerCard from "../components/LawyerCard";
import BannerCarousel from "../components/BannerCarousel";
import Loader from "../components/Loader";

const categories = ["Family Law", "Corporate Law", "Criminal Law", "Property Law", "Tax Law", "Immigration Law"];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiFetch("/lawyers/featured"), apiFetch("/lawyers/top")])
      .then(([f, t]) => { setFeatured(f); setTop(t); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <BannerCarousel />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-serif">Featured Lawyers</h2>
            <Link href="/lawyers" className="text-sm font-medium text-navy-700 dark:text-navy-200 hover:underline">View all →</Link>
          </div>
          {loading ? <Loader label="Loading lawyers..." /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((l, i) => <LawyerCard key={l._id} lawyer={l} index={i} />)}
            </div>
          )}
        </section>

        {top.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-serif mb-6">Top Legal Experts</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {top.map((l, i) => <LawyerCard key={l._id} lawyer={l} index={i} />)}
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-serif mb-6">Legal Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link
                  href={`/lawyers?specialization=${encodeURIComponent(cat)}`}
                  className="block bg-navy-50 dark:bg-white/5 hover:bg-navy-100 dark:hover:bg-white/10 rounded-2xl p-5 border border-navy-100 dark:border-white/10 text-center font-semibold text-navy-800 dark:text-navy-100 transition-colors"
                >
                  {cat}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
