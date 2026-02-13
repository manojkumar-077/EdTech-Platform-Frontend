"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Users, GraduationCap, BookOpen, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Admins",
      value: "12",
      icon: Users,
      href: "/dashboard/admin/admins",
    },
    {
      title: "Total Students",
      value: "245",
      icon: GraduationCap,
      href: "/dashboard/admin/students",
    },
    {
      title: "Subjects",
      value: "18",
      icon: BookOpen,
      href: "/dashboard/admin/syllabus",
    },
    {
      title: "Active Quizzes",
      value: "32",
      icon: FileText,
      href: "/dashboard/admin/quizzes",
    },
  ];

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Platform overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="border rounded p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{stat.title}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                  <Icon size={18} className="text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="border rounded p-4">
          <h2 className="text-sm font-medium mb-3">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/dashboard/admin/admins"
              className="border rounded p-3 hover:bg-gray-50 transition"
            >
              <Users size={16} className="mb-1 text-gray-600" />
              <p className="text-sm font-medium">Add Admin</p>
              <p className="text-xs text-gray-500">
                Create admin account
              </p>
            </Link>

            <Link
              href="/dashboard/admin/students"
              className="border rounded p-3 hover:bg-gray-50 transition"
            >
              <GraduationCap size={16} className="mb-1 text-gray-600" />
              <p className="text-sm font-medium">Add Student</p>
              <p className="text-xs text-gray-500">
                Onboard student
              </p>
            </Link>

            <Link
              href="/dashboard/admin/quizzes"
              className="border rounded p-3 hover:bg-gray-50 transition"
            >
              <FileText size={16} className="mb-1 text-gray-600" />
              <p className="text-sm font-medium">Create Quiz</p>
              <p className="text-xs text-gray-500">
                Add new quiz
              </p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
