"use client";

import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/utils/auth";

export default function AdminDashboard() {
  useAuth(["ADMIN"]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
