import { jwtDecode } from "jwt-decode";

const isBrowser = () => typeof window !== "undefined";

export const saveToken = (token: string) => {
  if (isBrowser()) localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem("token");
};

export const logout = () => {
  if (isBrowser()) {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  }
};

export const getUserRole = (): string | null => {
  if (!isBrowser()) return null;

  const storedRole = localStorage.getItem("userRole");
  if (storedRole) return storedRole;

  const token = getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};
