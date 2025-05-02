import React, { useEffect, useState } from "react";
import { Box, Avatar, alpha, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminNotifications from "./AdminNotifications";
import { api } from "../services/authService"; 

const Navbar = ({ toggleSidebar, isMobileView }) => {
  const secondaryColor = "#3b82f6";
  const [admin, setAdmin] = useState(null);


  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: {
          xs: "0.5rem 1rem",
          sm: "0.75rem 1.5rem"
        },
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#fff",
        height: {
          xs: "56px",
          sm: "64px"
        },
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxSizing: "border-box",
      }}
    >
      {}
      {isMobileView && (
        <IconButton 
          onClick={toggleSidebar}
          sx={{ 
            mr: 1,
            display: { xs: 'flex', md: 'none' },
            color: "#64748b"
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      {}
      <Box sx={{ flex: 1 }} />
      {}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <AdminNotifications admin={admin} api={api} />
        <Avatar 
          sx={{ 
            width: { xs: 32, sm: 40 }, 
            height: { xs: 32, sm: 40 }, 
            bgcolor: secondaryColor,
            boxShadow: `0 2px 10px ${alpha(secondaryColor, 0.4)}`,
            ml: 2
          }}
        >
          {admin?.name?.[0]?.toUpperCase() ?? "A"}
        </Avatar>
      </Box>
    </Box>
  );
};

export default Navbar;