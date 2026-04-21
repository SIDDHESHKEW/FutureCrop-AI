const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const fallbackBaseUrl = isLocalHost
  ? "http://127.0.0.1:8000"
  : "https://farmercrop-backend.onrender.com";

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl).trim();

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}
