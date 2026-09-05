"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <AlertTriangle size={48} className="mx-auto text-amber-400" />
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-4">Something went wrong</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">An unexpected error occurred. Please try again.</p>
      <button onClick={reset} className="inline-block mt-6 bg-navy-700 hover:bg-navy-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">Try Again</button>
    </div>
  );
}
