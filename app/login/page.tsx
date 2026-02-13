"use client";

import { useState } from "react";
import { login } from "@/services/auth.service";
import { saveToken, getUserRole } from "@/utils/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("ADMIN");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token } = await login({ email, password });
      saveToken(token);

      const userRole = getUserRole();
      if (userRole === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/student");
      }

      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg bg-white">
        
        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white p-10 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white text-blue-600 p-2 rounded-lg font-bold">
                🎓
              </div>
              <span className="font-semibold text-lg">CBSE AI EdTech</span>
            </div>

            <h1 className="text-3xl font-bold mb-4">
              Manage the Future of Education.
            </h1>

            <p className="text-blue-100 text-sm leading-relaxed">
              Powerful tools for content managers to organize syllabus and
              create engaging learning experiences.
            </p>
          </div>

          <div className="flex gap-3 text-xs">
            <span className="bg-blue-500/40 px-3 py-1 rounded-full">
              Secure SSL
            </span>
            <span className="bg-blue-500/40 px-3 py-1 rounded-full">
              AI Protected
            </span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          
          {/* Role Toggle */}
          <div className="flex justify-end mb-6">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`px-4 py-1.5 rounded-md text-sm ${
                  role === "STUDENT"
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("ADMIN")}
                className={`px-4 py-1.5 rounded-md text-sm ${
                  role === "ADMIN"
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-1">Welcome Back!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to your admin account to continue.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@email.com"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-600">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
