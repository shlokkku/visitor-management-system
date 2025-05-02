import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const StatCard = ({ title, value, icon }) => {
  const primaryColor = "#2c3e50";
  const secondaryColor = "#3498db";
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        padding: 2, 
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "100px",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 3
        },
        bgcolor: "#fff",
        borderLeft: `4px solid ${secondaryColor}`
      }}
    >
      <Box>
        <Typography variant="subtitle1" color="black" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "medium", color: primaryColor }}>
          {value}
        </Typography>
      </Box>
      <Box>
        {icon}
      </Box>
    </Paper>
  );
};

export default StatCard;