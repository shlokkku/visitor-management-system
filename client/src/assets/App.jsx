import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';
import { Link } from 'react-router-dom';
// Authentication Components
import Signup from '../components/Signup';
import SignIn from '../components/SignIn';
// Remove Dashboard import that's causing the error
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import {
  Dashboard as AdminDashboard,
  LegalDocuments,
  TenantManagement,
  ParkingPage,
  CommunicationPage,
  Complaints
} from '../pages';

// Inline component definitions to avoid import errors
const Unauthorized = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>Unauthorized Access</h1>
      <p>You don't have permission to access this page.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/admin" style={{ 
          marginRight: '10px',
          padding: '8px 16px',
          background: '#f0f0f0',
          textDecoration: 'none',
          borderRadius: '4px',
          color: '#333'
        }}>
          Go to Dashboard
        </Link>
        <Link to="/signin" style={{ 
          padding: '8px 16px',
          background: '#007bff',
          textDecoration: 'none',
          borderRadius: '4px',
          color: 'white'
        }}>
          Sign In with Different Account
        </Link>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ requiredRole }) => {
  const location = useLocation();
  
  // Check if token exists for authentication
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Get the user data from localStorage and extract the role
  const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const userRole = userData?.role; // Get the role from the user object
  
  console.log("Protected Route Check:");
  console.log("- Is authenticated:", isAuthenticated);
  console.log("- User data:", userData);
  console.log("- User role:", userRole);
  console.log("- Required role:", requiredRole);
  
  // If not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // If a role is required and user doesn't have it, redirect to unauthorized
  if (requiredRole && userRole !== requiredRole) {
    console.log("- Role mismatch, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If authenticated and authorized, render the child routes
  console.log("- Authentication and authorization successful");
  return <Outlet />;
};

// Layout component for admin pages
const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden' 
      }}>
        <Navbar />
        <div style={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          padding: '20px' 
        }}>
          <Outlet /> {/* This will render child routes */}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Protected User Routes - Modified to redirect directly to admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          {/* Add other user routes here */}
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="legal-documents" element={<LegalDocuments />} />
            <Route path="tenant-management" element={<TenantManagement />} />
            <Route path="parking" element={<ParkingPage />} />
            <Route path="communications" element={<CommunicationPage />} />
            <Route path="complaints" element={<Complaints />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;