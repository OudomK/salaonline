import { Navigate } from "react-router-dom";
import { PERMISSIONS } from "@/constants/permissions";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userPermissions = user?.role?.permissions || [];

  if (!token) {
    if (requireAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !userPermissions.includes(PERMISSIONS.DASHBOARD.READ)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
