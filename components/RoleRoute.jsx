"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

// Wrap PrivateRoute's job + also gates by role (e.g. "admin", "lawyer")
export default function RoleRoute({ allow = [], children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (role && !allow.includes(role)) {
      router.replace("/");
    }
  }, [loading, user, role, allow, router, pathname]);

  if (loading || !user || !role || !allow.includes(role)) {
    return <Loader label="Checking access..." />;
  }
  return children;
}
