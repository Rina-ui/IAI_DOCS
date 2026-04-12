// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic API response type
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

// Debug logging helper for requests
function logRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body?: unknown,
) {
  console.groupCollapsed(`🚀 API Request: ${method} ${url}`);
  console.log("📍 URL:", url);
  console.log("📝 Method:", method);
  console.log("🔑 Headers:", {
    ...headers,
    // Mask authorization token for security
    Authorization: headers["Authorization"]
      ? `${headers["Authorization"].substring(0, 20)}...`
      : "N/A",
  });
  if (body) {
    console.log("📦 Request Body:", body);
  }
  console.groupEnd();
}

// Debug logging helper for responses
function logResponse(
  method: string,
  url: string,
  status: number,
  statusText: string,
  data?: unknown,
  duration?: number,
) {
  const isSuccess = status >= 200 && status < 300;
  const icon = isSuccess ? "✅" : "❌";
  
  console.groupCollapsed(`${icon} API Response: ${method} ${url} - ${status}`);
  console.log("📍 URL:", url);
  console.log("🔢 Status:", `${status} ${statusText}`);
  console.log("⏱️ Duration:", duration ? `${duration}ms` : "N/A");
  if (data) {
    console.log("📦 Response Data:", data);
  }
  console.groupEnd();
}

// Debug logging helper for errors
function logError(
  method: string,
  url: string,
  error: unknown,
  duration?: number,
) {
  console.groupCollapsed(`⚠️ API Error: ${method} ${url}`);
  console.log("📍 URL:", url);
  console.log("⏱️ Duration:", duration ? `${duration}ms` : "N/A");
  console.error("❌ Error:", error);
  console.groupEnd();
}

// Base fetcher with auth and error handling
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const method = options.method || "GET";
  const startTime = Date.now();

  // Get token from localStorage (client-side only)
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  // Build headers
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  // Add auth header if token exists and Authorization header not already set
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Log request
  logRequest(method, url, headers, options.body);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const duration = Date.now() - startTime;

    // Handle errors
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      let errorData: unknown;

      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.message || errorResponse.error || errorMessage;
        errorData = errorResponse;
      } catch {
        // If we can't parse error JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      // Log error response
      logError(method, url, { status: response.status, message: errorMessage, data: errorData }, duration);

      throw new ApiError(response.status, errorMessage, errorData);
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Log successful non-JSON response
      logResponse(method, url, response.status, response.statusText, undefined, duration);
      return {} as T;
    }

    const data = await response.json() as Promise<T>;
    
    // Log successful JSON response
    logResponse(method, url, response.status, response.statusText, data, duration);

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;

    // Re-throw ApiError as-is (already logged above)
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      const networkError = new ApiError(0, "Network error: Unable to connect to the server");
      logError(method, url, networkError, duration);
      throw networkError;
    }

    // Log unexpected errors
    logError(method, url, error, duration);
    throw error;
  }
}

// HTTP method helpers
export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { method: "GET", ...options }),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { method: "DELETE", ...options }),
};

export default api;
