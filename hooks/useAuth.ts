"use client";

import { useEffect } from "react";
import { getUserRole, logout } from "@/utils/auth";
import { useRouter } from "next/navigation";

export const useAuth = (allowedRoles: string[]) => {
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();
    if (!role || !allowedRoles.includes(role)) {
      logout();
      router.push("/login");
    }
  }, []);
};
