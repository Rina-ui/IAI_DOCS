export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "student" | "teacher";
  level?: string;
  points?: number;
  speciality?: string;
  verified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  level: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
