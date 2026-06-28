import { User } from "../types/User";

// Placeholder API functions. These will be replaced with real backend calls later.
export async function fakeLogin(email: string, _password: string): Promise<User> {
  return {
    id: "user-1",
    name: email.split("@")[0] || "Demo User",
    email,
  };
}

export async function fakeRegister(
  name: string,
  email: string,
  _password: string,
): Promise<User> {
  return {
    id: crypto.randomUUID(),
    name,
    email,
  };
}
