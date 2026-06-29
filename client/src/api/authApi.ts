import { User } from "../types/User";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const AUTH_USER_STORAGE_KEY = "job-tracker-user";
export const AUTH_TOKEN_STORAGE_KEY = "job-tracker-token";

export type AuthResponse = {
  user: User;
  token: string;
};

async function handleAuthResponse(response: Response): Promise<AuthResponse> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Authentication failed.");
  }

  return data as AuthResponse;
}

// These calls use the custom Express auth routes and receive a JWT from the backend.
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleAuthResponse(response);
}

export async function registerUser(name: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  return handleAuthResponse(response);
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Could not load current user.");
  }

  return data.user as User;
}
