"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import tokenService from "@/lib/tokenService";

interface RoleGuardProps {
  allowedRoles: string[];
  fallbackRedirect?: string;
  children: React.ReactNode;
}

/**
 * Client-side role guard component
 * Provides an additional layer of protection alongside middleware
 * 
 * Usage:
 * <RoleGuard allowedRoles={['student']}>
 *   {children}
 * </RoleGuard>
 */
export default function RoleGuard({
  allowedRoles,
  fallbackRedirect,
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        // Get token
        const token = tokenService.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        // Decode JWT to get role
        const parts = token.split(".");
        if (parts.length !== 3) {
          router.push("/login");
          return;
        }

        const payload = parts[1];
        const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
        const userRole = decoded.role;

        console.log("🔐 RoleGuard check:", {
          userRole,
          allowedRoles,
          isAllowed: allowedRoles.includes(userRole),
        });

        if (!userRole || !allowedRoles.includes(userRole)) {
          // Not authorized - redirect to appropriate dashboard
          const redirectPath = fallbackRedirect || getRoleDashboard(userRole);
          console.warn(
            `⚠️ RoleGuard: Access denied for role "${userRole}" to route. Redirecting to: ${redirectPath}`
          );
          router.push(redirectPath);
          return;
        }

        // Authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error("RoleGuard: Error checking authorization:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [allowedRoles, fallbackRedirect, router]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary font-medium">Vérification des droits...</p>
        </div>
      </div>
    );
  }

  // Render children only if authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Get the appropriate dashboard path for a role
 */
function getRoleDashboard(role: string | undefined): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "teacher":
      return "/teacher";
    case "student":
      return "/student";
    default:
      return "/login";
  }
}
