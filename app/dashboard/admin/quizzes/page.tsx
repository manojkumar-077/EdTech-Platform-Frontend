"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Plus, Search, Edit, Trash2, FileText, Clock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getQuizzesByClass } from "@/services/quiz.service";

const classGrades = ["CLASS_8", "CLASS_9", "CLASS_10", "CLASS_11", "CLASS_12"];

interface Quiz {
  id: number;
  title: string;
  classGrade: string;
  durationMinutes: number;
  questionCount: number;
  createdAt: string;
}

export default function QuizManagementPage() {
  const [selectedClass, setSelectedClass] = useState(classGrades[0]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, [selectedClass]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getQuizzesByClass(selectedClass);
      setQuizzes(data);
    } catch {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Quiz Management</h1>
            <p className="text-sm text-gray-500">
              Manage quizzes
            </p>
          </div>

          <Link
            href="/dashboard/admin/quizzes/create"
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 text-white rounded"
          >
            <Plus size={16} />
            Create Quiz
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search quiz"
              className="w-full pl-9 pr-3 py-2 border rounded text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="w-full sm:w-56 px-3 py-2 border rounded text-sm"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade.replace("CLASS_", "Class ")}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">
            Loading...
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="border rounded p-8 text-center text-gray-500">
            <FileText className="mx-auto mb-2" size={24} />
            <p className="text-sm mb-3">No quizzes found</p>
            <Link
              href="/dashboard/admin/quizzes/create"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 text-white rounded"
            >
              <Plus size={16} />
              Create Quiz
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="border rounded p-4">
                <div className="mb-2">
                  <p className="text-sm font-medium">{quiz.title}</p>
                  <p className="text-xs text-gray-500">
                    {quiz.classGrade.replace("CLASS_", "Class ")}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    {quiz.questionCount} questions
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {quiz.durationMinutes} minutes
                  </div>
                  <div className="text-gray-500">
                    Created {new Date(quiz.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Link
                    href={`/dashboard/admin/quizzes/${quiz.id}/edit`}
                    className="flex-1 border py-1.5 rounded text-xs text-center"
                  >
                    <Edit size={14} className="inline mr-1" />
                    Edit
                  </Link>
                  <button className="flex-1 border py-1.5 rounded text-xs text-red-600">
                    <Trash2 size={14} className="inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
