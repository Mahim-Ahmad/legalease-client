"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const titleMap = {
  "/": "LegalEase — Find & Hire Trusted Lawyers",
  "/lawyers": "Browse Lawyers | LegalEase",
  "/login": "Login | LegalEase",
  "/register": "Register | LegalEase",
  "/dashboard/user/hiring-history": "My Hirings | LegalEase",
  "/dashboard/user/update-profile": "Update Profile | LegalEase",
  "/dashboard/user/comments": "My Comments | LegalEase",
  "/dashboard/lawyer/hiring-history": "Hiring Requests | LegalEase",
  "/dashboard/lawyer/manage-legal-profile": "Manage Profile | LegalEase",
  "/dashboard/admin/manage-users": "Manage Users | LegalEase",
  "/dashboard/admin/all-transactions": "Transactions | LegalEase",
  "/dashboard/admin/analytics": "Analytics | LegalEase",
};

export default function DynamicTitle() {
  const pathname = usePathname();
  useEffect(() => {
    if (titleMap[pathname]) document.title = titleMap[pathname];
    else if (pathname.startsWith("/lawyers/")) document.title = "Lawyer Details | LegalEase";
    else document.title = "LegalEase";
  }, [pathname]);
  return null;
}
