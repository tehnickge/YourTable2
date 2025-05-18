"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserTypes } from "@/types/user";

export function withAuth(
  Component: React.ComponentType,
  requiredRole?: UserTypes
) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [authStatus, setAuthStatus] = useState<
      "loading" | "authenticated" | "unauthorized"
    >("loading");

    useEffect(() => {
      const verifyAuth = async () => {
        try {
          // Запрос к API, который проверит куки автоматически
          const response = await fetch("/api/auth/verify", {
            credentials: "include", // Важно для передачи HttpOnly кук
          });

          if (!response.ok) throw new Error("Not authenticated");

          const user = await response.json();

          if (requiredRole && user.type !== requiredRole) {
            setAuthStatus("unauthorized");
            router.push("/403");
            return;
          }

          setAuthStatus("authenticated");
        } catch (error) {
          setAuthStatus("unauthorized");
          router.push("/auth/login");
        }
      };

      verifyAuth();
    }, [router, requiredRole]);

    if (authStatus === "loading") {
      return <div>Loading...</div>;
    }

    if (authStatus === "unauthorized") {
      return null;
    }

    return <Component {...props} />;
  };
}
