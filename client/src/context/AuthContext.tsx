import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { fakeLogin, fakeRegister } from "../api/authApi";
import { User } from "../types/User";

type AuthContextValue = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "job-tracker-user";

function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser) as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser);

  async function login(email: string, password: string) {
    const user = await fakeLogin(email, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
  }

  async function register(name: string, email: string, password: string) {
    const user = await fakeRegister(name, email, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  }

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      register,
      logout,
    }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
