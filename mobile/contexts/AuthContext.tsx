import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { authService } from "@/services/authService";
import type { User, LoginRequest, RegisterRequest } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    console.log("[Auth] Checking auth...");
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      console.log("[Auth] Token found:", token ? "YES" : "NO");
      if (token) {
        const userData = await SecureStore.getItemAsync("user_data");
        console.log("[Auth] User data found:", userData ? "YES" : "NO");
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser(parsed);
          console.log("[Auth] User restored:", parsed.firstName, parsed.lastName);
        }
      }
    } catch (error) {
      console.error("[Auth] Auth check failed:", error);
    } finally {
      console.log("[Auth] Loading set to false");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (data: LoginRequest) => {
    console.log("[Auth] Logging in...");
    const response = await authService.login(data);
    
    if (!response || !response.token) {
      throw new Error("Identifiants invalides ou erreur serveur");
    }

    console.log("[Auth] Login successful, token:", response.token ? "YES" : "NO");
    await SecureStore.setItemAsync("auth_token", response.token);
    await SecureStore.setItemAsync("user_data", JSON.stringify(response.user));
    setUser(response.user);
    console.log("[Auth] User set:", response.user.firstName);
  };

  const register = async (data: RegisterRequest) => {
    console.log("[Auth] Registering...");
    const response = await authService.register(data);

    if (!response || !response.token) {
      throw new Error("Erreur lors de l'inscription");
    }

    console.log("[Auth] Register successful");
    await SecureStore.setItemAsync("auth_token", response.token);
    await SecureStore.setItemAsync("user_data", JSON.stringify(response.user));
    setUser(response.user);
  };

  const logout = async () => {
    console.log("[Auth] Logging out...");
    await SecureStore.deleteItemAsync("auth_token");
    await SecureStore.deleteItemAsync("user_data");
    setUser(null);
  };

  console.log("[Auth] Render - loading:", loading, "user:", user?.firstName || "null", "isAuth:", !!user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
