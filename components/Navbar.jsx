"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Scale, Search, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const dashboardHome = { user: "/dashboard/user/hiring-history", lawyer: "/dashboard/lawyer/hiring-history", admin: "/dashboard/admin/manage-users" };

export default function Navbar() {
  const { user, role, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to log out");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/lawyers?search=${encodeURIComponent(search)}`);
    setSearch("");
  };

  const linkClass = (href) => {
    const active = pathname === href;
    return `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? "bg-navy-700 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-navy-50 dark:hover:bg-white/10"
    }`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0d1425]/95 backdrop-blur border-b border-navy-100 dark:border-white/10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-navy-700 flex items-center justify-center text-gold-400">
            <Scale size={18} />
          </div>
          <span className="text-lg font-extrabold tracking-tight font-serif">
            <span className="text-navy-800 dark:text-white">Legal</span>
            <span className="text-gold-600">Ease</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lawyers..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-navy-200 dark:border-white/10 bg-white dark:bg-[#131d35] text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-200"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </form>

        <div className="hidden lg:flex items-center gap-1">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/lawyers" className={linkClass("/lawyers")}>Browse Lawyers</Link>
          {user && role && (
            <Link href={dashboardHome[role]} className={pathname.startsWith("/dashboard") ? linkClass(pathname) : "px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-navy-50 dark:hover:bg-white/10"}>
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative">
              <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=" + (user.displayName || user.email)}
                  alt={user.displayName || "User"}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-200"
                />
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-xl card-shadow py-1.5 z-40">
                  <p className="px-3.5 py-2 text-xs text-gray-400 truncate capitalize">{role || "member"} &middot; {user.displayName || user.email}</p>
                  <button onClick={() => { setProfileOpen(false); handleLogout(); }} className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-navy-700 dark:text-navy-200 border border-navy-200 dark:border-white/10 rounded-lg px-4 py-1.5 hover:bg-navy-50 dark:hover:bg-white/10 transition-colors">Login</Link>
              <Link href="/register" className="btn-press text-sm font-medium bg-navy-700 hover:bg-navy-800 text-white rounded-lg px-4 py-1.5 transition-colors">Register</Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-gray-700 dark:text-gray-200" onClick={() => setOpen((o) => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-navy-100 dark:border-white/10 px-4 py-3 flex flex-col gap-1.5 bg-white dark:bg-[#0d1425]">
          <Link href="/" className={linkClass("/")} onClick={() => setOpen(false)}>Home</Link>
          <Link href="/lawyers" className={linkClass("/lawyers")} onClick={() => setOpen(false)}>Browse Lawyers</Link>
          {user && role && (
            <Link href={dashboardHome[role]} className={linkClass(dashboardHome[role])} onClick={() => setOpen(false)}>Dashboard</Link>
          )}
          {user ? (
            <button onClick={() => { setOpen(false); handleLogout(); }} className="text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50">Logout</button>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")} onClick={() => setOpen(false)}>Login</Link>
              <Link href="/register" className={linkClass("/register")} onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
