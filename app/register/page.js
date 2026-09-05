"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserPlus, Eye, EyeOff, User, Scale } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { user, loading: authLoading, registerUser, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [authLoading, user, router]);

  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "", confirmPassword: "" });
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }
    const passError = validatePassword(form.password);
    if (passError) {
      setError(passError);
      toast.error(passError);
      return;
    }
    setLoading(true);
    try {
      await registerUser(form.name, form.email, form.photoURL, form.password);
      // Save the chosen role so it gets applied on the user's first real login,
      // instead of risking an immediate sign-in right after registration.
      localStorage.setItem("legalease_pending_role", JSON.stringify({ email: form.email, role }));
      toast.success("Registered successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      const message = /already/i.test(err?.message || "") ? "This email is already registered." : "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Registered with Google!");
    } catch {
      toast.error("Google sign-up failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white dark:bg-[#131d35] rounded-2xl card-shadow border border-navy-100 dark:border-white/10 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center font-serif">Register</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1.5">Create your LegalEase account</p>

        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg px-3.5 py-2.5">{error}</p>}

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button type="button" onClick={() => setRole("user")}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border-2 transition-colors ${role === "user" ? "border-navy-700 bg-navy-50 dark:bg-white/10 text-navy-800 dark:text-white" : "border-navy-100 dark:border-white/10 text-gray-500"}`}>
            <User size={18} /> <span className="text-sm font-medium">I need a lawyer</span>
          </button>
          <button type="button" onClick={() => setRole("lawyer")}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border-2 transition-colors ${role === "lawyer" ? "border-navy-700 bg-navy-50 dark:bg-white/10 text-navy-800 dark:text-white" : "border-navy-100 dark:border-white/10 text-gray-500"}`}>
            <Scale size={18} /> <span className="text-sm font-medium">I'm a lawyer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Name</label>
            <input name="name" required value={form.name} onChange={handleChange}
              className="w-full mt-1 border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-200" placeholder="Your full name" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange}
              className="w-full mt-1 border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-200" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Photo URL</label>
            <input name="photoURL" value={form.photoURL} onChange={handleChange}
              className="w-full mt-1 border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-200" placeholder="https://example.com/photo.jpg" />
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
            <p className="text-[11px] text-gray-400 mt-1">At least 6 characters, with uppercase and lowercase letters.</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Confirm Password</label>
            <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange}
              className="w-full mt-1 border border-navy-200 dark:border-white/10 bg-white dark:bg-[#0d1425] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy-200" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-press w-full flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60">
            <UserPlus size={16} /> {loading ? "Creating account..." : "Register"}
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
          Already have an account? <Link href="/login" className="text-navy-700 dark:text-navy-200 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
