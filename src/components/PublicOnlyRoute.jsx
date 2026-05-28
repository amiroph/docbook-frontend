import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicOnlyRoute({ children }) {
  const { user } = useAuth();

  if (!user) return children;

  // Already logged in → redirect to their dashboard
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/patient/dashboard" replace />;
}