import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Keeps dashboard routes private until a user is logged in with a stored JWT.
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
