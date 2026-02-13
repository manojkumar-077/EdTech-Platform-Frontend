"use client";

import { useEffect } from "react";
import { getUserRole } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles: ("ADMIN" | "STUDENT")[];
}

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();
    if (!role || !allowedRoles.includes(role as any)) {
      router.push("/login");
    }
  }, [router, allowedRoles]);

  const role = getUserRole() as "ADMIN" | "STUDENT" | null;

  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={role} />
      <div className="lg:ml-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
