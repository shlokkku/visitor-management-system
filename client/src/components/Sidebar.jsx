import React from "react";
import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/Report";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionIcon from "@mui/icons-material/Description"; // Import DescriptionIcon

const Sidebar = ({ isMobile }) => {
  // Professional color scheme
  const bgGradient = "linear-gradient(to right, #2c3e50, #4a5568)"; // Gradient for sidebar

  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon sx={{ mr: 1 }} />, path: "/admin" },
    { name: "Tenants", icon: <PeopleIcon sx={{ mr: 1 }} />, path: "/admin/tenant-management" },
    { name: "Complaints", icon: <ReportIcon sx={{ mr: 1 }} />, path: "/admin/complaints" },
    { name: "Messages", icon: <NotificationsIcon sx={{ mr: 1 }} />, path: "/admin/communications" },
    { name: "ParkingLot", icon: <SecurityIcon sx={{ mr: 1 }} />, path: "/admin/parking" },
    { name: "Settings", icon: <SettingsIcon sx={{ mr: 1 }} />, path: "/admin/settings" },
    { name: "Legal Documents", icon: <DescriptionIcon sx={{ mr: 1 }} />, path: "/admin/legal-documents" } // Add DescriptionIcon
  ];

  return (
    <Box
      component="nav"
      sx={{
        width: isMobile ? "100%" : "240px",
        flexShrink: 0,
        background: bgGradient,
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: 2,
        height: "100%",
        zIndex: 10,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, pl: 1 }}>
        <DashboardIcon sx={{ mr: 1, color: "#ffffff" }} />
        <Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
          Admin Panel
        </Typography>
      </Box>
      
      {/* Navigation menu items with icons */}
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {menuItems.map((item) => (
          <Box 
            component="li" 
            key={item.name}
            sx={{ 
              py: 1.5, 
              pl: 1,
              borderRadius: 1,
              mb: 1,
              "&:hover": { 
                bgcolor: "rgba(255,255,255,0.1)",
                cursor: "pointer"
              },
              ...(item.name === "Dashboard" ? { bgcolor: "rgba(255,255,255,0.15)" } : {}),
              display: "flex",
              alignItems: "center"
            }}
          >
            <NavLink 
              to={item.path} 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit', 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%' 
              }}
              activestyle={{
                fontWeight: "bold",
                color: "#f1f1f1"
              }}
            >
              {item.icon}
              <Typography>{item.name}</Typography>
            </NavLink>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;