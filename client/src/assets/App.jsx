import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet 
} from 'react-router-dom';

// Authentication Components
import Signup from '../components/Signup';
import SignIn from '../components/SignIn';
import Dashboard from '../components/Dashboard';

// Admin Dashboard Components
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import {
  Dashboard as AdminDashboard,
  LegalDocuments,
  TenantManagement,
  ParkingPage,
  CommunicationPage
} from '../pages';

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
        <Route path="/" element={<Navigate to="/signup" replace />} />

        {/* User Dashboard */}
        <Route 
          path="/dashboard" 
          element={<Dashboard />} 
        />

        {/* Admin Routes with Layout */}
        <Route 
          path="/admin" 
          element={<AdminLayout />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="legal-documents" element={<LegalDocuments />} />
          <Route path="tenant-management" element={<TenantManagement />} />
          <Route path="parking" element={<ParkingPage />} />
          <Route path="communications" element={<CommunicationPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;