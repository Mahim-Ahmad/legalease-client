"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  { title: "Find the Right Lawyer for Your Case", text: "Browse verified legal professionals across every specialization." },
  { title: "Hire with Confidence", text: "Transparent rates, real client comments, and secure online payment." },
  { title: "Manage Everything in One Place", text: "Track your hiring history, payments, and conversations from your dashboard." },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center relative">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            <span className="inline-block bg-white/10 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">⚖️ LegalEase Hiring Platform</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto font-serif">{slides[index].title}</h1>
            <p className="text-navy-100/80 max-w-lg mx-auto mt-4 text-sm sm:text-base">{slides[index].text}</p>
          </motion.div>
        </AnimatePresence>

        <Link href="/lawyers" className="btn-press inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-6 py-3 rounded-xl mt-8 transition-colors">
          Browse Lawyers <ArrowRight size={18} />
        </Link>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><ChevronLeft size={16} /></button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-gold-400" : "w-1.5 bg-white/30"}`} />
            ))}
          </div>
          <button onClick={() => setIndex((i) => (i + 1) % slides.length)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>
    </section>
  );
}
