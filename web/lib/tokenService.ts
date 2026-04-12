const tokenService = {
  getToken: () => {
    // Try localStorage first (client-side only)
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },
  setToken: (token: string) => {
    // Store in localStorage for client-side API calls
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      
      // Also set as cookie for middleware (server-side) access
      // Cookie is accessible to Next.js middleware via request.cookies
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure=${process.env.NODE_ENV === "production"}`;
    }
  },
  removeToken: () => {
    // Remove from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      
      // Also remove cookie
      document.cookie = "token=; path=/; max-age=0; SameSite=Strict; Secure=true";
      
      // Clear all user-related data
      localStorage.removeItem("user");
    }
  },
};

export default tokenService;
