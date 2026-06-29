import { Application } from "../types/Application";
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from "./authApi";

const API_BASE_URL = "http://localhost:5000/api";

export type ApplicationData = Omit<Application, "id" | "userId" | "createdAt" | "updatedAt">;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (response.status === 401) {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      window.location.assign("/login");
    }

    throw new Error(errorData?.message || "Something went wrong with the API request.");
  }

  return response.json() as Promise<T>;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

// Frontend API helpers. These functions are the only place this feature calls the backend.
export async function getApplications() {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Application[]>(response);
}

export async function createApplication(applicationData: ApplicationData) {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(applicationData),
  });

  return handleResponse<Application>(response);
}

export async function updateApplication(id: string, applicationData: ApplicationData) {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(applicationData),
  });

  return handleResponse<Application>(response);
}

export async function deleteApplication(id: string) {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (response.status === 401) {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      window.location.assign("/login");
    }

    throw new Error(errorData?.message || "Could not delete the application.");
  }
}
