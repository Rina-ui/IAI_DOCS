import api from "@/lib/api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/lib/types";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  return api.post<AuthResponse>("/auth/login", data);
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  return api.post<AuthResponse>("/auth/register", data);
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload as AuthResponse["user"];
  } catch {
    throw new Error("Invalid token");
  }
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
};
