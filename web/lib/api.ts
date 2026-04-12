// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

// Base fetcher with auth and error handling
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
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

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

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

      throw new ApiError(response.status, errorMessage, errorData);
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(0, "Network error: Unable to connect to the server");
    }
    
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
