import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const location = useLocation();
  
  // Check for token
  const token = localStorage.getItem('token');
  
  // Parse user data
  const userData = localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')) : null;
  
  // Debugging logs (active only in development mode)
  if (process.env.NODE_ENV === 'development') {
    console.log("ProtectedRoute - Required role:", requiredRole);
    console.log("ProtectedRoute - User data from localStorage:", userData);
    if (userData) {
      console.log("ProtectedRoute - User role property:", userData.role);
      console.log("ProtectedRoute - All user properties:", Object.keys(userData));
    }
  }

  // If not authenticated, redirect to sign-in
  if (!token) {
    console.log("ProtectedRoute - No token found, redirecting to signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If a role is required and user doesn't have it
  if (requiredRole) {
    const userRole = userData?.role || null; // Fallback if role is missing
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`ProtectedRoute - Comparing roles: user role="${userRole}", required role="${requiredRole}"`);
      console.log(`ProtectedRoute - Exact match: ${userRole === requiredRole}`);
    }
    
    if (!userRole || userRole !== requiredRole) {
      console.log("ProtectedRoute - Role mismatch, redirecting to unauthorized");
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log("ProtectedRoute - Authorization successful, rendering protected content");
  return <Outlet />;
};

export default ProtectedRoute;