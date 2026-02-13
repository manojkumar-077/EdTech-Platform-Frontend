"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Modal from "@/components/modals/Modal";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";

interface Admin {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/admin");
      setAdmins(res.data);
    } catch {
      toast.error("Failed to fetch admins");
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin", {
        email: formData.email,
        password: formData.password,
      });
      toast.success("Admin created");
      setIsModalOpen(false);
      setFormData({ email: "", password: "", confirmPassword: "" });
      fetchAdmins();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm("Delete this admin?")) return;

    try {
      await api.delete(`/admin/${id}`);
      toast.success("Admin deleted");
      fetchAdmins();
    } catch {
      toast.error("Failed to delete admin");
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Admin Management</h1>
            <p className="text-sm text-gray-500">
              Manage admin accounts
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 text-white rounded"
          >
            <Plus size={16} />
            Add Admin
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by email"
          className="w-full px-3 py-2 border rounded text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Admin Table */}
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No admins found
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="border-t">
                    <td className="px-4 py-2">{admin.email}</td>
                    <td className="px-4 py-2">{admin.role}</td>
                    <td className="px-4 py-2">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {admin.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
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
          title="Add Admin"
        >
          <form onSubmit={handleCreateAdmin} className="space-y-3">
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
