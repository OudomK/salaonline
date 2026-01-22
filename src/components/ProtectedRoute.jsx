import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role?.name;

  if (!token) {
    if (requireAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
