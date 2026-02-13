"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Modal from "@/components/modals/Modal";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";

interface Student {
  id: number;
  fullName: string;
  email: string;
  classGrade: string;
  schoolName: string;
}

export default function StudentOnboardingPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    classGrade: "CLASS_8",
    schoolName: "",
    fatherName: "",
    fatherPhone: "",
    address: "",
  });

  const classGrades = ["CLASS_8", "CLASS_9", "CLASS_10", "CLASS_11", "CLASS_12"];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/student");
      setStudents(res.data || []);
    } catch {
      toast.error("Failed to load students");
      setStudents([]);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const { confirmPassword, ...payload } = formData;

    try {
      await api.post("/student", payload);
      toast.success("Student created");
      setIsModalOpen(false);
      setFormData({
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        classGrade: "CLASS_8",
        schoolName: "",
        fatherName: "",
        fatherPhone: "",
        address: "",
      });
      fetchStudents();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("Delete this student?")) return;

    try {
      await api.delete(`/student/${id}`);
      toast.success("Student deleted");
      fetchStudents();
    } catch {
      toast.error("Failed to delete student");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Student Onboarding</h1>
            <p className="text-sm text-gray-500">
              Manage student accounts
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 text-white rounded"
          >
            <Plus size={16} />
            Add Student
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full px-3 py-2 border rounded text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Table */}
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">School</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t">
                    <td className="px-4 py-2">{student.fullName}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className="px-4 py-2">
                      {student.classGrade.replace("CLASS_", "Class ")}
                    </td>
                    <td className="px-4 py-2">{student.schoolName}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:underline"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Student"
          size="lg"
        >
          <form onSubmit={handleCreateStudent} className="space-y-3">

            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-3 py-2 border rounded text-sm"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-3 py-2 border rounded text-sm"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full px-3 py-2 border rounded text-sm"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full px-3 py-2 border rounded text-sm"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            <select
              className="w-full px-3 py-2 border rounded text-sm"
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

            <input
              type="text"
              placeholder="School Name"
              className="w-full px-3 py-2 border rounded text-sm"
              value={formData.schoolName}
              onChange={(e) =>
                setFormData({ ...formData, schoolName: e.target.value })
              }
            />

            <textarea
              placeholder="Address"
              rows={2}
              className="w-full px-3 py-2 border rounded text-sm"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border py-2 rounded text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white py-2 rounded text-sm"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
