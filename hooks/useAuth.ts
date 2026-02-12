"use client";

import { useEffect } from "react";
import { getUserRole, logout } from "@/utils/auth";
import { useRouter } from "next/navigation";

export const useAuth = (allowedRoles: string[]) => {
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();

    if (!role) {
      logout();
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.push("/login");
    }
  }, []);
};
