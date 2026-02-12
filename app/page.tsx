"use client";

import { useEffect } from "react";
import { getUserRole } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();
    if (!role) router.push("/login");
    else if (role === "ADMIN") router.push("/dashboard/admin");
    else router.push("/dashboard/student");
  }, []);

  return null;
}
