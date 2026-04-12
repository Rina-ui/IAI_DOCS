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
  const endpoint = `${apiUrl}/auth/login`;

  // Debug: Log request details
  console.group("🔐 Login Request");
  console.log("📍 Endpoint:", endpoint);
  console.log("📝 Method: POST");
  console.log("📦 Request Body:", {
    email,
    password: "***HIDDEN***", // Security: never log passwords
  });
  console.groupEnd();

  const startTime = Date.now();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password } as LoginData),
    });

    const duration = Date.now() - startTime;

    // Debug: Log response details
    console.group(`🔐 Login Response - Status: ${response.status}`);
    console.log("🔢 HTTP Status:", response.status, response.statusText);
    console.log("⏱️ Duration:", `${duration}ms`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("❌ Error Response:", error);
      console.groupEnd();
      throw new Error(
        error.message || `Login failed with status ${response.status}`,
      );
    }

    const resJson = await response.json();

    // Debug: Log successful response
    console.log("✅ Response Data:", {
      token: resJson.token ? `${resJson.token.substring(0, 20)}...` : "MISSING",
      user: resJson.user,
    });
    console.log("👤 User Role:", resJson.user?.role);
    console.groupEnd();

    if (!resJson.token || !resJson.user) {
      console.error("❌ Invalid response: missing token or user data");
      throw new Error("Invalid response from server: missing token or user data");
    }

    return resJson as LoginResponse;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.group("⚠️ Login Error");
    console.log("⏱️ Duration:", `${duration}ms`);
    console.error("❌ Error:", error);
    console.groupEnd();
    throw error;
  }
};

export default loginService;
export type { LoginData, LoginResponse, User };
