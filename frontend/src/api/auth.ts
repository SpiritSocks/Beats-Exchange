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

export function logout() {
  return apiFetch("/api/logout", {
    method: "POST",
  });
}
