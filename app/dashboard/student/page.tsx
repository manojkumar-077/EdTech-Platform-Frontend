"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getStudentProfile } from "@/services/student.service";
import { logout } from "@/utils/auth";

export default function StudentDashboard() {
  useAuth(["STUDENT"]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getStudentProfile()
      .then(setProfile)
      .catch(logout);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      {profile && (
        <div className="bg-white p-4 rounded shadow">
          <p><b>Name:</b> {profile.fullName}</p>
          <p><b>Class:</b> {profile.classGrade}</p>
          <p><b>School:</b> {profile.schoolName}</p>
        </div>
      )}

      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
