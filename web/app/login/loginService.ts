interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

const loginService = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password } as LoginData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Login failed with status ${response.status}`,
    );
  }

  const resJson = await response.json();

  if (!resJson.token || !resJson.user) {
    throw new Error("Invalid response from server: missing token or user data");
  }

  return resJson as LoginResponse;
};

export default loginService;
export type { LoginData, LoginResponse, User };
