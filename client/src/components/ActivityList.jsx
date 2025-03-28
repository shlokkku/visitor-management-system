import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ActivityList = ({ activities }) => {
  // Professional color scheme
  const primaryColor = "#2c3e50"; // Dark blue/slate
  const secondaryColor = "#3498db"; // Bright blue accent
  const lightBg = "rgba(52, 152, 219, 0.08)"; // Very light blue background

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        height: "calc(100vh - 240px)", 
        borderRadius: 2, 
        padding: 2,
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: 3
        },
        bgcolor: "#fff",
        borderTop: `3px solid ${secondaryColor}`
      }}
    >
      <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: "normal", color: primaryColor }}>
        Main Gate Activity
      </Typography>
      
      {/* Vertical scrollable content with visible scrollbar */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: "auto",
        overflowX: "hidden",
        pr: 1,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
          borderRadius: "10px"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c1c1c1",
          borderRadius: "10px"
        }
      }}>
        {activities.map((item) => (
          <Box 
            key={item} 
            sx={{
              width: "100%",
              padding: 2,
              borderRadius: 1,
              bgcolor: lightBg,
              border: `1px solid rgba(44, 62, 80, 0.1)`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                borderLeft: `3px solid ${secondaryColor}`
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: `rgba(52, 152, 219, 0.2)`,
                border: `1px solid ${secondaryColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2
              }}>
                <Typography sx={{ color: primaryColor, fontWeight: "medium" }}>{item}</Typography>
              </Box>
              <Typography variant="body1" color={primaryColor}>
                Activity Point {item}
              </Typography>
            </Box>
            <Typography variant="body2" color="#2c3e50" x={{ mr: 3 }}>
              3/12/2025
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ActivityList;