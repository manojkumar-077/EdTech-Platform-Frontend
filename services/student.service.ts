import api from "./api";

export const getStudentProfile = async () => {
  const res = await api.get("/students/profile");
  return res.data;
};
