import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ActivityList = ({ activities }) => {
  const primaryColor = "#2c3e50";
  const secondaryColor = "#3498db";
  const lightBg = "rgba(52, 152, 219, 0.08)";

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        height: { xs: "auto", md: "calc(100vh - 240px)" }, 
        minHeight: { xs: "300px", sm: "400px" },
        borderRadius: 2, 
        padding: { xs: 1.5, sm: 2 },
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
      <Typography variant="h6" component="h3" sx={{ 
        mb: 2, 
        fontWeight: "normal", 
        color: primaryColor,
        fontSize: { xs: "1rem", sm: "1.25rem" }
      }}>
        Main Gate Activity
      </Typography>
      
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
        {activities.length === 0 ? (
          <Typography sx={{ color: "#7f8c8d", textAlign: "center", mt: 4 }}>
            No activity recorded at the main gate.
          </Typography>
        ) : (
          activities.map((item) => (
            <Box 
              key={item.id} 
              sx={{
                width: "100%",
                padding: { xs: 1.5, sm: 2 },
                borderRadius: 1,
                bgcolor: lightBg,
                border: `1px solid rgba(44, 62, 80, 0.1)`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: { sm: "space-between" },
                mb: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  borderLeft: `3px solid ${secondaryColor}`
                }
              }}
            >
              <Box sx={{ 
                display: "flex", 
                alignItems: "center",
                mb: { xs: 1, sm: 0 }
              }}>
                <Box sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  borderRadius: 1,
                  bgcolor: `rgba(52, 152, 219, 0.2)`,
                  border: `1px solid ${secondaryColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2
                }}>
                  <Typography sx={{ 
                    color: primaryColor, 
                    fontWeight: "medium",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }
                  }}>
                    {item.name}
                  </Typography>
                </Box>
                <Typography variant="body1" color={primaryColor} sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                }}>
                  {item.type} - {item.status}
                </Typography>
              </Box>
              <Typography variant="body2" color="#2c3e50" sx={{ 
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                mt: { xs: 1, sm: 0 }
              }}>

              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default ActivityList;
