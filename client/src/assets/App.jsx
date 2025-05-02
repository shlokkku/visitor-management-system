"use client";

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Signup from "../components/Signup";
import SignIn from "../components/SignIn";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Settings from "../pages/Settings";
import AdminProfile from "../pages/AdminProfile";

import {
  Dashboard as AdminDashboard,
  LegalDocuments,
  TenantManagement,
  ParkingPage,
  CommunicationPage,
  Complaints,
  NoticesBoard,
  PendingsDues
} from "../pages"
import { api } from "../services/authService";
// Unauthorized Page
const Unauthorized = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
      padding: "20px",
    }}
  >
    <h1>Unauthorized Access</h1>
    <p>You don't have permission to access this page.</p>
    <div style={{ marginTop: "20px" }}>
      <Link
        to="/admin"
        style={{
          marginRight: "10px",
          padding: "8px 16px",
          background: "#f0f0f0",
          textDecoration: "none",
          borderRadius: "4px",
          color: "#333",
        }}
      >
        Go to Dashboard
      </Link>
      <Link
        to="/signin"
        style={{
          padding: "8px 16px",
          background: "#007bff",
          textDecoration: "none",
          borderRadius: "4px",
          color: "white",
        }}
      >
        Sign In with Different Account
      </Link>
    </div>
  </div>
);

// ProtectedRoute
const ProtectedRoute = ({ requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userRole = user?.role?.toLowerCase();
  const requiredRoleLower = requiredRole?.toLowerCase();

  if (!token || !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  if (requiredRole && userRole !== requiredRoleLower) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

// Admin Layout
const AdminLayout = ({ admin, setAdmin }) => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobileView);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile && !sidebarOpen) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#f8f9fa",
        position: "relative",
      }}
    >
      {}
      <div
        style={{
          width: isMobileView ? (sidebarOpen ? "260px" : "0") : "260px",
          flexShrink: 0,
          height: "100vh",
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
          transition: "width 0.3s ease",
          position: isMobileView ? "fixed" : "sticky", 
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {(sidebarOpen || !isMobileView) && <Sidebar isMobile={isMobileView} />}
      </div>
      {}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100vh",
          width: isMobileView ? "100%" : `calc(100% - ${sidebarOpen ? "260px" : "0px"})`,
          transition: "width 0.3s ease, margin-left 0.3s ease",
          marginLeft: isMobileView && sidebarOpen ? "260px" : "0",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <Navbar toggleSidebar={toggleSidebar} isMobileView={isMobileView} admin={admin} />
        </div>
        <div
          style={{
            flexGrow: 1,
            overflow: "auto",
            padding: 0,
            height: "calc(100vh - 64px)",
          }}
        >
          <Outlet context={{ admin, setAdmin }} />
        </div>
      </div>
      {/* Mobile Overlay */}
      {isMobileView && sidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get("/api/admin/profile");
        setAdmin(res.data);
      } catch {
        setAdmin(null);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminLayout admin={admin} setAdmin={setAdmin} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="legal-documents" element={<LegalDocuments />} />
            <Route path="tenant-management" element={<TenantManagement />} />
            <Route path="parking" element={<ParkingPage />} />
            <Route path="communications" element={<CommunicationPage />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notices" element={<NoticesBoard />} />
            <Route path="pending-dues" element={<PendingsDues />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;