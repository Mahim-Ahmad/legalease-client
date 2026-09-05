"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const { user, loading: authLoading, loginUser, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  useEffect(() => {
    if (!authLoading && user) router.replace(from);
  }, [authLoading, user, router, from]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      toast.success("Logged in successfully!");
      router.push(from);
    } catch {
      const message = "Invalid email or password. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
    } catch {
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white dark:bg-[#131d35] rounded-2xl card-shadow border border-navy-100 dark:border-white/10 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center font-serif">Login</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1.5">Welcome back to LegalEase</p>

        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg px-3.5 py-2.5">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange}
              className="w-full mt-1 border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-200" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Password</label>
            <div className="relative mt-1">
              <input type={showPassword ? "text" : "password"} name="password" required value={form.password} onChange={handleChange}
                className="w-full border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 pr-10 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-200" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-press w-full flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60">
            <LogIn size={16} /> {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-navy-100 dark:bg-white/10 flex-1" /><span className="text-xs text-gray-400">OR</span><div className="h-px bg-navy-100 dark:bg-white/10 flex-1" />
        </div>

        <button onClick={handleGoogle} className="btn-press w-full flex items-center justify-center gap-2 border border-navy-200 dark:border-white/10 rounded-lg py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-white/10 transition-colors">
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.6 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.5 35.6 44 30.2 44 24c0-1.3-.1-2.5-.4-3.5z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Don&apos;t have an account? <Link href="/register" className="text-navy-700 dark:text-navy-200 font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return <Suspense fallback={null}><LoginForm /></Suspense>;
}
