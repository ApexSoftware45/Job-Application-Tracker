import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Keeps dashboard routes private until the fake user is logged in.
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
