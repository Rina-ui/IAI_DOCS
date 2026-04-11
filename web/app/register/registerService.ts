interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  level: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface RegisterResponse {
  token: string;
  user: User;
}

const registerService = async (
  data: RegisterData,
): Promise<RegisterResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const response = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Registration failed with status ${response.status}`,
    );
  }

  const resJson = await response.json();

  if (!resJson.token || !resJson.user) {
    throw new Error("Invalid response from server: missing token or user data");
  }

  return resJson as RegisterResponse;
};

export default registerService;
export type { RegisterData, RegisterResponse, User };
