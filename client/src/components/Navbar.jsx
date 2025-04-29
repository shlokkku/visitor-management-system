import React from "react";
import { Box, InputBase, Badge, Avatar, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
  // Professional color scheme
  const primaryColor = "#1e293b"; // Dark blue/slate
  const secondaryColor = "#3b82f6"; // Blue accent

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#fff",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Search Bar */}
      <Box
        sx={{
          position: "relative",
          borderRadius: "0.5rem",
          backgroundColor: alpha("#f1f5f9", 0.8),
          width: "280px",
          display: "flex",
          alignItems: "center",
          '&:hover': {
            backgroundColor: alpha("#f1f5f9", 1),
          },
          transition: "all 0.2s ease",
        }}
      >
        <Box sx={{ p: 1 }}>
          <SearchIcon sx={{ color: "#64748b" }} />
        </Box>
        <InputBase
          placeholder="Search..."
          sx={{ 
            ml: 1, 
            flex: 1,
            color: primaryColor,
            '&::placeholder': {
              color: "#94a3b8",
              opacity: 1,
            }
          }}
        />
      </Box>
      
      {/* Right Side Actions */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Badge 
          badgeContent={3} 
          color="error" 
          sx={{ 
            mr: 3,
            '& .MuiBadge-badge': {
              backgroundColor: "#ef4444",
              minWidth: "18px",
              height: "18px",
              fontSize: "0.65rem",
            }
          }}
        >
          <NotificationsIcon sx={{ color: "#64748b" }} />
        </Badge>
        <Avatar 
          sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: secondaryColor,
            boxShadow: `0 2px 10px ${alpha(secondaryColor, 0.4)}`,
          }}
        >
          A
        </Avatar>
      </Box>
    </Box>
  );
};

export default Navbar;