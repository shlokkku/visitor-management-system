import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { api } from "../services/authService"; // Import the Axios instance with interceptors

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Professional color scheme
  const primaryColor = "#2c3e50"; // Dark blue/slate
  const secondaryColor = "#3498db"; // Bright blue accent
  const lightBg = "rgba(52, 152, 219, 0.08)"; // Very light blue background

  // Fetch notices from the backend
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/notices"); // Use the Axios instance
        setNotices(response.data || []); // Handle response as an array directly
      } catch (err) {
        console.error("Error fetching notices:", err);
        setError("Failed to load notices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        height: "100%", 
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
        Notice Board
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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : notices.length > 0 ? (
          notices.map((item) => (
            <Box 
              key={item.id} 
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 1,
                bgcolor: lightBg,
                border: `1px solid rgba(44, 62, 80, 0.1)`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  borderLeft: `3px solid ${secondaryColor}`
                }
              }}
            >
              <Box 
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: `rgba(52, 152, 219, 0.2)`,
                  border: `1px solid ${secondaryColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2
                }}
              >
                <Typography sx={{ color: primaryColor, fontWeight: "medium" }}>{item.title.charAt(0)}</Typography>
              </Box>
              <Typography color="black" variant="body2">
                {item.title} {/* Render the title of the notice */}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No notices available</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default NoticeBoard;