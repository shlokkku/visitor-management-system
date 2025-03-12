// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default ProtectedRoute;