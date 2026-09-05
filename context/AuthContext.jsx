"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession, signIn, signUp, signOut, updateUser } from "../lib/auth-client";
import { apiFetch } from "../lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "legalease_jwt";

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  const rawUser = session?.user || null;
  const user = rawUser
    ? { ...rawUser, displayName: rawUser.name, photoURL: rawUser.image }
    : null;

  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  const fetchRole = useCallback(async (jwt, email) => {
    try {
      // If this email registered with a chosen role, apply it once, then clear it.
      try {
        const pending = JSON.parse(localStorage.getItem("legalease_pending_role") || "null");
        if (pending && pending.email === email) {
          await apiFetch("/users/set-role", { method: "PATCH", token: jwt, body: JSON.stringify({ role: pending.role }) });
          localStorage.removeItem("legalease_pending_role");
          setRole(pending.role);
          return;
        }
      } catch {
        // ignore malformed pending-role storage
      }
      const data = await apiFetch("/users/role", { token: jwt });
      setRole(data.role);
    } catch {
      setRole("user");
    }
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      if (!rawUser) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setRole(null);
        setTokenLoading(false);
        return;
      }
      try {
        const saved = JSON.parse(localStorage.getItem(TOKEN_KEY) || "null");
        if (saved && saved.email === rawUser.email && saved.token) {
          setToken(saved.token);
          await fetchRole(saved.token, rawUser.email);
          setTokenLoading(false);
          return;
        }
      } catch {
        // corrupted storage, fall through
      }
      try {
        const res = await fetch("/api/jwt");
        const data = await res.json();
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, JSON.stringify({ token: data.token, email: rawUser.email }));
          setToken(data.token);
          await fetchRole(data.token, rawUser.email);
        }
      } finally {
        setTokenLoading(false);
      }
    };
    if (!isPending) fetchToken();
  }, [rawUser, isPending, fetchRole]);

  const registerUser = async (name, email, photoURL, password) => {
    const { data, error } = await signUp.email({ name, email, password, image: photoURL });
    if (error) throw error;
    return data;
  };

  const loginUser = async (email, password) => {
    const { data, error } = await signIn.email({ email, password });
    if (error) throw error;
    const res = await fetch("/api/jwt");
    const jwtData = await res.json();
    if (jwtData.token) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify({ token: jwtData.token, email }));
      setToken(jwtData.token);
      await fetchRole(jwtData.token, email);
    }
    return data;
  };

  const loginWithGoogle = async () => {
    const { data, error } = await signIn.social({ provider: "google", callbackURL: "/" });
    if (error) throw error;
    return data;
  };

  const logoutUser = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setRole(null);
    await signOut();
  };

  const updateUserProfile = async (name, photoURL) => {
    const { data, error } = await updateUser({ name, image: photoURL });
    if (error) throw error;
    return data;
  };

  const chooseRole = async (chosenRole) => {
    if (!token) return;
    const data = await apiFetch("/users/set-role", {
      method: "PATCH",
      token,
      body: JSON.stringify({ role: chosenRole }),
    });
    setRole(data.role);
    return data;
  };

  const value = {
    user,
    role,
    token,
    loading: isPending || tokenLoading,
    registerUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUserProfile,
    chooseRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
