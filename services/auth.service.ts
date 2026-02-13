import api from "./api";

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  // Store role in localStorage for easy access
  if (res.data.role) {
    localStorage.setItem("userRole", res.data.role);
  }
  return res.data;
};
