import api from "./api";

export const getStudentProfile = async () => {
  const res = await api.get("/student/profile");
  return res.data;
};

export const getStudentById = async (id: number) => {
  const res = await api.get(`/student/${id}`);
  return res.data;
};

export const updateStudent = async (id: number, data: any) => {
  const res = await api.put(`/student/${id}`, data);
  return res.data;
};

export const deleteStudent = async (id: number) => {
  const res = await api.delete(`/student/${id}`);
  return res.data;
};
