import Link from "next/link";
import { Scale } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <Scale size={48} className="mx-auto text-navy-300" />
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-4 font-serif">404</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">This page doesn&apos;t exist. Let&apos;s get you back on track.</p>
      <Link href="/" className="inline-block mt-6 bg-navy-700 hover:bg-navy-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">Back to Home</Link>
    </div>
  );
}
