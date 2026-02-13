"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Modal from "@/components/modals/Modal";
import { Plus, BookOpen, FileText, Upload } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllSubjects,
  createSubject,
  uploadMaterial,
  getMaterialsBySubject,
} from "@/services/syllabus.service";

const classGrades = ["CLASS_8", "CLASS_9", "CLASS_10", "CLASS_11", "CLASS_12"];

interface Subject {
  id: number;
  name: string;
  classGrade: string;
}

interface Material {
  id: number;
  displayName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export default function SyllabusManagementPage() {
  const [selectedClass, setSelectedClass] = useState(classGrades[0]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Record<number, Material[]>>({});
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [subjectForm, setSubjectForm] = useState({ name: "" });
  const [materialForm, setMaterialForm] = useState({
    displayName: "",
    file: null as File | null,
  });
  const [fetchingSubjects, setFetchingSubjects] = useState(true);

  const subjects = allSubjects.filter(
    (s) => s.classGrade === selectedClass
  );

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    subjects.forEach(async (subject) => {
      try {
        const mats = await getMaterialsBySubject(subject.id);
        setMaterials((prev) => ({ ...prev, [subject.id]: mats }));
      } catch {
        setMaterials((prev) => ({ ...prev, [subject.id]: [] }));
      }
    });
  }, [selectedClass, allSubjects]);

  const fetchSubjects = async () => {
    setFetchingSubjects(true);
    try {
      const data = await getAllSubjects();
      setAllSubjects(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch subjects");
      setAllSubjects([]);
    } finally {
      setFetchingSubjects(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSubject({
        name: subjectForm.name,
        classGrade: selectedClass,
      });
      toast.success("Subject created");
      setIsSubjectModalOpen(false);
      setSubjectForm({ name: "" });
      fetchSubjects();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create subject");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !materialForm.file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", materialForm.file);
    formData.append("displayName", materialForm.displayName);
    formData.append("subjectId", selectedSubject.toString());

    try {
      await uploadMaterial(formData);
      toast.success("Material uploaded");
      setIsMaterialModalOpen(false);
      setMaterialForm({ displayName: "", file: null });
      setSelectedSubject(null);
      fetchSubjects();
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Syllabus Management</h1>
            <p className="text-sm text-gray-500">
              Subjects & study materials
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 text-white rounded"
            >
              <Plus size={16} />
              Subject
            </button>

            <button
              onClick={() => setIsMaterialModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded"
            >
              <Upload size={16} />
              Material
            </button>
          </div>
        </div>

        {/* Class Selector */}
        <select
          className="w-full sm:w-64 px-3 py-2 border rounded text-sm"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classGrades.map((grade) => (
            <option key={grade} value={grade}>
              {grade.replace("CLASS_", "Class ")}
            </option>
          ))}
        </select>

        {/* Subjects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fetchingSubjects ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              Loading...
            </div>
          ) : subjects.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No subjects found
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id} className="border rounded p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{subject.name}</p>
                    <p className="text-xs text-gray-500">
                      {subject.classGrade.replace("CLASS_", "Class ")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {materials[subject.id]?.length ? (
                    materials[subject.id].map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center gap-2 border rounded px-2 py-1"
                      >
                        <FileText size={14} className="text-gray-400" />
                        <div className="min-w-0">
                          <p className="text-sm truncate">
                            {material.displayName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(material.fileSize)} •{" "}
                            {new Date(material.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">
                      No materials
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Subject Modal */}
        <Modal
          isOpen={isSubjectModalOpen}
          onClose={() => setIsSubjectModalOpen(false)}
          title="Add Subject"
        >
          <form onSubmit={handleCreateSubject} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Subject name"
              className="w-full px-3 py-2 border rounded text-sm"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ name: e.target.value })}
            />

            <select
              className="w-full px-3 py-2 border rounded text-sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classGrades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade.replace("CLASS_", "Class ")}
                </option>
              ))}
            </select>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubjectModalOpen(false)}
                className="flex-1 border py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white py-2 rounded text-sm"
              >
                {loading ? "Saving..." : "Create"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Upload Material Modal */}
        <Modal
          isOpen={isMaterialModalOpen}
          onClose={() => setIsMaterialModalOpen(false)}
          title="Upload Material"
        >
          <form onSubmit={handleUploadMaterial} className="space-y-3">
            <select
              required
              className="w-full px-3 py-2 border rounded text-sm"
              value={selectedSubject || ""}
              onChange={(e) => setSelectedSubject(Number(e.target.value))}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Display name"
              required
              className="w-full px-3 py-2 border rounded text-sm"
              value={materialForm.displayName}
              onChange={(e) =>
                setMaterialForm({ ...materialForm, displayName: e.target.value })
              }
            />

            <input
              type="file"
              required
              className="w-full text-sm"
              onChange={(e) =>
                setMaterialForm({
                  ...materialForm,
                  file: e.target.files?.[0] || null,
                })
              }
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(false)}
                className="flex-1 border py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white py-2 rounded text-sm"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
