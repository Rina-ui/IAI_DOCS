import { api } from "../api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "./auth.types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      return response.data;
    } catch (error) {
      console.error("[AuthService] Login error:", error);
      return { token: "", user: {} as AuthResponse["user"] };
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("[AuthService] Register error:", error);
      return { token: "", user: {} as AuthResponse["user"] };
    }
  },

  async logout(): Promise<void> {
    try {
      // No backend endpoint needed for JWT logout
    } catch (error) {
      console.error("[AuthService] Logout error:", error);
    }
  },
};
