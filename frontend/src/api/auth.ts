import { apiFetch } from "./client";
import type { User } from "./types";

type AuthResponse = {
  user: User;
  token: string;
};

export type { User };

export function register(payload: {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}) {
  return apiFetch("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<AuthResponse>;
}

export function login(payload: { email: string; password: string }) {
  return apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<AuthResponse>;
}

export function me() {
  return apiFetch("/api/me") as Promise<User>;
}

export function updateProfile(payload: { name?: string; about?: string | null }) {
  return apiFetch("/api/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  }) as Promise<User>;
}

export function uploadAvatar(file: File): Promise<User> {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const formData = new FormData();
  formData.append("avatar", file);

  return fetch(`${baseUrl}/api/me/avatar`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.message || `API error: ${res.status}`);
    }
    return res.json();
  });
}

export function logout() {
  return apiFetch("/api/logout", {
    method: "POST",
  });
}
