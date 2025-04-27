import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  console.log("Protected Route Check:");
  console.log("- Is authenticated:", !!token);
  console.log("- User data:", user);

  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  const userRole = user.role?.toLowerCase();
  const requiredRoleLower = requiredRole?.toLowerCase();

  console.log("- User role (lowercase):", userRole);
  console.log("- Required role (lowercase):", requiredRoleLower);

  if (requiredRole && userRole !== requiredRoleLower) {
    console.log("- Role mismatch, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("- Authentication and authorization successful");
  return <Outlet />;
};

export default ProtectedRoute;