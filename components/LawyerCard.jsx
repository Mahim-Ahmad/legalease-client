"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, DollarSign } from "lucide-react";

export default function LawyerCard({ lawyer, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-[#131d35] rounded-2xl overflow-hidden border border-navy-100 dark:border-white/10 card-shadow"
    >
      <div className="relative h-40 bg-navy-50 dark:bg-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lawyer.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(lawyer.name || "Lawyer")}`}
          alt={lawyer.name}
          className="w-full h-full object-cover"
        />
        {lawyer.status === "busy" && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">Busy</span>
        )}
        <span className="absolute top-3 left-3 bg-navy-700 text-gold-300 text-[11px] font-semibold px-2.5 py-1 rounded-full">{lawyer.specialization}</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white">{lawyer.name}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span className="flex items-center gap-1"><DollarSign size={13} /> ${lawyer.hourlyFee}/hr</span>
          {lawyer.location && <span className="flex items-center gap-1"><MapPin size={13} /> {lawyer.location}</span>}
        </div>
        <Link
          href={`/lawyers/${lawyer._id}`}
          className="btn-press block text-center mt-4 bg-navy-700 hover:bg-navy-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}
