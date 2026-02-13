"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Search, Clock, FileText, Play, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getQuizzesByClass } from "@/services/quiz.service";
import { getStudentProfile } from "@/services/student.service";

interface Quiz {
  id: number;
  title: string;
  classGrade: string;
  durationMinutes: number;
  questionCount: number;
  attemptStatus?: string;
}

export default function StudentQuizDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentClass, setStudentClass] = useState<string>("");

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const profile = await getStudentProfile();
      setStudentClass(profile.classGrade);
      if (profile.classGrade) {
        const data = await getQuizzesByClass(profile.classGrade);
        setQuizzes(data);
      }
    } catch (error: any) {
      toast.error("Failed to load quizzes");
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["STUDENT"]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Dashboard</h1>
          <p className="text-gray-600 mt-2">Available quizzes for your class</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search quizzes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quizzes Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h3>
            <p className="text-gray-500">Check back later for new quizzes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {quiz.classGrade.replace("CLASS_", "Class ")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText size={16} />
                    <span>{quiz.questionCount} Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>{quiz.durationMinutes} minutes</span>
                  </div>
                  {quiz.attemptStatus && (
                    <div className="flex items-center gap-2 text-sm">
                      {quiz.attemptStatus === "COMPLETED" ? (
                        <>
                          <CheckCircle size={16} className="text-green-600" />
                          <span className="text-green-600 font-medium">Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock size={16} className="text-orange-600" />
                          <span className="text-orange-600 font-medium">In Progress</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    // Navigate to quiz attempt page
                    window.location.href = `/dashboard/student/quizzes/${quiz.id}`;
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Play size={16} />
                  {quiz.attemptStatus === "COMPLETED" ? "Review Quiz" : "Start Quiz"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
