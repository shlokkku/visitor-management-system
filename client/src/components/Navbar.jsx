import React from "react";
import { Box, InputBase, Badge, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
  // Professional color scheme
  const primaryColor = "#2c3e50"; // Dark blue/slate
  const secondaryColor = "#3498db"; // Bright blue accent

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 1,
        paddingLeft: 3,
        paddingRight: 3,
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fff",
        height: "64px",
      }}
    >
      {/* Search Bar - Reduced opacity and adjusted width */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 1,
          backgroundColor: "rgba(245, 245, 245, 0.7)", // Reduced opacity
          width: "250px", // Reduced width
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ p: 1 }}>
          <SearchIcon sx={{ color: "#2c3e50" }} />
        </Box>
        <InputBase
          placeholder="Search..."
          sx={{ ml: 1, flex: 1 , color: "#2c3e50"}}
        />
      </Box>
      
      {/* Right Side Actions */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Badge badgeContent={3} color="error" sx={{ mr: 3 }}>
          <NotificationsIcon sx={{ color: primaryColor }} />
        </Badge>
        <Avatar sx={{ width: 40, height: 40, bgcolor: secondaryColor }}>A</Avatar>
      </Box>
    </Box>
  );
};

export default Navbar;