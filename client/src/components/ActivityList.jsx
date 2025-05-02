import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ActivityList = ({ activities }) => {
  const primaryColor = "#2c3e50";
  const secondaryColor = "#3498db";
  const lightBg = "rgba(52, 152, 219, 0.08)";
  const flaggedBorder = "2.5px solid #e74c3c"; // Red color for flagged visitor

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
                border: item.suspicious ? flaggedBorder : `1px solid rgba(44, 62, 80, 0.1)`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: { sm: "space-between" },
                mb: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  borderLeft: item.suspicious 
                    ? flaggedBorder 
                    : `3px solid ${secondaryColor}`
                }
              }}
            >
              <Box sx={{ 
                display: "flex", 
                alignItems: "center",
                mb: { xs: 1, sm: 0 }
              }}>
                <Box sx={{
                  minWidth: { xs: 70, sm: 90 },
                  maxWidth: { xs: 120, sm: 160 },
                  height: { xs: 32, sm: 40 },
                  borderRadius: '8px',
                  bgcolor: `rgba(52, 152, 219, 0.2)`,
                  border: `1px solid ${secondaryColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                  px: 1.5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  <Typography sx={{ 
                    color: primaryColor, 
                    fontWeight: 500,
                    fontSize: { xs: "0.82rem", sm: "0.96rem" }
                  }} noWrap>
                    {item.name}
                  </Typography>
                </Box>
                <Typography variant="body1" color={primaryColor} sx={{
                  fontSize: { xs: "0.93rem", sm: "1rem" }
                }}>
                  {item.type} - {item.status}
                </Typography>
              </Box>
              <Typography variant="body2" color="#2c3e50" sx={{ 
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                mt: { xs: 1, sm: 0 }
              }}>
                {/* You can add more detail here if needed */}
                {item.suspicious && (
                  <Typography sx={{ color: "#e74c3c", fontWeight: 600 }}>
                    Flagged Visitor
                  </Typography>
                )}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default ActivityList;