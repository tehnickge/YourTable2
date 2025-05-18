"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserTypes } from "@/types/user";

export function useAuth(requiredRole?: UserTypes) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Not authenticated");

        const user = await response.json();

        if (requiredRole && user.type !== requiredRole) {
          router.push("/403");
        }
      } catch (error) {
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router, requiredRole]);
}
