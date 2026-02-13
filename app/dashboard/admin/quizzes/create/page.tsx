"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createQuiz } from "@/services/quiz.service";

const classGrades = ["CLASS_8", "CLASS_9", "CLASS_10", "CLASS_11", "CLASS_12"];

interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export default function CreateQuizPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    classGrade: classGrades[0],
    durationMinutes: 30,
    questions: [] as Question[],
  });

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswerIndex: 0,
        },
      ],
    });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.questions.length === 0) {
      toast.error("Add at least one question");
      return;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        toast.error(`Question ${i + 1} has empty options`);
        return;
      }
    }

    setLoading(true);
    try {
      await createQuiz(formData);
      toast.success("Quiz created");
      window.location.href = "/dashboard/admin/quizzes";
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin/quizzes"
            className="p-2 border rounded hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Create Quiz</h1>
            <p className="text-sm text-gray-500">
              Add quiz questions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Quiz Details */}
          <div className="border rounded p-4">
            <h2 className="text-sm font-medium mb-3">Quiz Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Quiz title"
                className="md:col-span-2 px-3 py-2 border rounded text-sm"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <select
                className="px-3 py-2 border rounded text-sm"
                value={formData.classGrade}
                onChange={(e) =>
                  setFormData({ ...formData, classGrade: e.target.value })
                }
              >
                {classGrades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade.replace("CLASS_", "Class ")}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="number"
              min={1}
              className="mt-3 w-40 px-3 py-2 border rounded text-sm"
              value={formData.durationMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  durationMinutes: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Questions */}
          <div className="border rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 text-white rounded"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            {formData.questions.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">
                No questions added
              </p>
            ) : (
              <div className="space-y-4">
                {formData.questions.map((question, qIndex) => (
                  <div key={qIndex} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        Question {qIndex + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      required
                      className="w-full px-3 py-2 border rounded text-sm mb-3"
                      placeholder="Question text"
                      value={question.questionText}
                      onChange={(e) =>
                        updateQuestion(qIndex, "questionText", e.target.value)
                      }
                    />

                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswerIndex === oIndex}
                            onChange={() =>
                              updateQuestion(
                                qIndex,
                                "correctAnswerIndex",
                                oIndex
                              )
                            }
                          />
                          <input
                            type="text"
                            required
                            className="flex-1 px-3 py-2 border rounded text-sm"
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href="/dashboard/admin/quizzes"
              className="flex-1 border py-2 rounded text-sm text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || formData.questions.length === 0}
              className="flex-1 bg-gray-900 text-white py-2 rounded text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Quiz"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
