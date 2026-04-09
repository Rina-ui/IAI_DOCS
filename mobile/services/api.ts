import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

console.log("[API] Base URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── REQUEST INTERCEPTOR ────────────────────────────────────────────────────
api.interceptors.request.use(
  async (config) => {
    // Attach auth token
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.error("[API] Failed to get auth token:", e);
    }

    // Timestamp pour calculer la durée
    (config as any).metadata = { startTime: Date.now() };

    const method  = config.method?.toUpperCase() ?? "?";
    const fullUrl = (config.baseURL ?? "") + (config.url ?? "");

    console.log(
      `\n━━━━━━━━━━━━━━━━━━ 📤 REQUEST ━━━━━━━━━━━━━━━━━━\n` +
      `  ${method} ${fullUrl}\n` +
      `  Headers: ${JSON.stringify(config.headers, null, 4)}\n` +
      (config.params
        ? `  Params:  ${JSON.stringify(config.params, null, 4)}\n`
        : "") +
      (config.data
        ? `  Body:    ${JSON.stringify(
            typeof config.data === "string"
              ? JSON.parse(config.data)
              : config.data,
            null,
            4
          )}\n`
        : "") +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    );

    return config;
  },
  (error) => {
    console.error("[API] ❌ Request setup error:", error);
    return Promise.reject(error);
  }
);

// ─── RESPONSE INTERCEPTOR ───────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - ((response.config as any).metadata?.startTime ?? Date.now());
    const method   = response.config.method?.toUpperCase() ?? "?";
    const fullUrl  = (response.config.baseURL ?? "") + (response.config.url ?? "");

    console.log(
      `\n━━━━━━━━━━━━━━━━━━ ✅ RESPONSE ━━━━━━━━━━━━━━━━━━\n` +
      `  ${method} ${fullUrl}\n` +
      `  Status:   ${response.status} ${response.statusText}\n` +
      `  Duration: ${duration}ms\n` +
      `  Data:     ${JSON.stringify(response.data, null, 4)}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    );

    return response;
  },
  async (error) => {
    const duration = Date.now() - ((error.config as any)?.metadata?.startTime ?? Date.now());
    const method   = error.config?.method?.toUpperCase() ?? "?";
    const fullUrl  = (error.config?.baseURL ?? "") + (error.config?.url ?? "");

    if (error.response) {
      console.error(
        `\n━━━━━━━━━━━━━━━━━━ ❌ ERROR RESPONSE ━━━━━━━━━━━━\n` +
        `  ${method} ${fullUrl}\n` +
        `  Status:   ${error.response.status} ${error.response.statusText ?? ""}\n` +
        `  Duration: ${duration}ms\n` +
        `  Data:     ${JSON.stringify(error.response.data, null, 4)}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );

      // Nettoyer le token si 401
      if (error.response.status === 401) {
        try {
          await SecureStore.deleteItemAsync("auth_token");
          await SecureStore.deleteItemAsync("user_data");
          console.warn("[API] 🔒 Token expiré — session effacée.");
        } catch (e) {
          console.error("[API] Failed to clear auth:", e);
        }
      }
    } else if (error.request) {
      console.error(
        `\n━━━━━━━━━━━━━━━━━━ ❌ NO RESPONSE ━━━━━━━━━━━━━━\n` +
        `  ${method} ${fullUrl}\n` +
        `  Erreur réseau : aucune réponse du serveur.\n` +
        `  Duration: ${duration}ms\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );
    } else {
      console.error("[API] ❌ Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export { api, API_URL };
export default api;

