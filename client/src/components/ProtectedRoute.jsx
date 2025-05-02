import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const ProtectedRoute = ({ requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role?.toLowerCase();
  const requiredRoleLower = requiredRole?.toLowerCase();

  console.log("ProtectedRoute Debug:");
  console.log("- Token:", token);
  console.log("- User:", user);
  console.log("- User role:", userRole);
  console.log("- Required role:", requiredRoleLower);

  if (!token || !user) {
    console.log("- Redirecting to sign-in...");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  if (requiredRole && userRole !== requiredRoleLower) {
    console.log("- Role mismatch. Redirecting to unauthorized...");
    return <Navigate to="/unauthorized" replace />;
  }
  console.log("- Access granted.");
  return <Outlet />;
};
export default ProtectedRoute;