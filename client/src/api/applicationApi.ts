import { Application } from "../types/Application";

const API_BASE_URL = "http://localhost:5000/api";

export type ApplicationData = Omit<Application, "id" | "createdAt" | "updatedAt">;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Something went wrong with the API request.");
  }

  return response.json() as Promise<T>;
}

// Frontend API helpers. These functions are the only place this feature calls the backend.
export async function getApplications() {
  const response = await fetch(`${API_BASE_URL}/applications`);
  return handleResponse<Application[]>(response);
}

export async function createApplication(applicationData: ApplicationData) {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
    },
    body: JSON.stringify(applicationData),
  });

  return handleResponse<Application>(response);
}

export async function deleteApplication(id: string) {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Could not delete the application.");
  }
}
