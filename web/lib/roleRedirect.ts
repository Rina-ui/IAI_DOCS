/**
 * Role-based redirect utility
 * Redirects users to their appropriate dashboard based on their role
 */

export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

/**
 * Role to dashboard path mapping
 */
const ROLE_ROUTES: Record<string, string> = {
  [UserRole.ADMIN]: "/admin",
  [UserRole.TEACHER]: "/teacher",
  [UserRole.STUDENT]: "/student",
};

/**
 * Get the appropriate dashboard path for a given role
 * @param role - The user's role
 * @returns The dashboard path for that role, defaults to /student
 */
export function getRoleDashboard(role: string): string {
  const normalizedRole = role?.toLowerCase();
  
  // Debug log
  console.log("🔄 Role-based redirect:", {
    originalRole: role,
    normalizedRole,
    targetRoute: ROLE_ROUTES[normalizedRole] || "/student",
  });

  return ROLE_ROUTES[normalizedRole] || "/student";
}

/**
 * Redirect user to their role-appropriate dashboard
 * @param role - The user's role from the backend response
 */
export function redirectByRole(role: string): void {
  const targetPath = getRoleDashboard(role);
  console.log(`🚀 Redirecting to: ${targetPath}`);
  window.location.href = targetPath;
}
