import React, { useEffect, useState } from "react";
import PendingDues from "./PendingDues"; // Import the PendingDues component
import { CircularProgress, Typography, Box } from "@mui/material";
import { api } from "../services/authService"; // Axios instance with interceptors

const PendingDuesContainer = () => {
  const [dues, setDues] = useState([]); // State to store pending dues
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch dues on component mount
  useEffect(() => {
    const fetchPendingDues = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all dues from the backend
        const response = await api.get("/api/dues");
        console.log("Fetched data from API:", response.data); // Debug the API response
        setDues(response.data || []); // Pass the full response data to PendingDues
      } catch (err) {
        console.error("Error fetching pending dues:", err);
        setError("Failed to load pending dues. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDues();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return <PendingDues dues={dues} />;
};

export default PendingDuesContainer;