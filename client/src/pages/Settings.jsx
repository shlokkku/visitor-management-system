"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  Divider,
  FormControlLabel,
  Grid,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { api } from "../services/authService"; 
const defaultSettings = {
  notifications: true,
  darkMode: false,
  twoFactor: false,
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

 
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/admin/settings");
        setSettings({
          notifications: Boolean(res.data.notifications),
          darkMode: Boolean(res.data.darkMode),
          twoFactor: typeof res.data.twoFactor === "undefined" ? false : Boolean(res.data.twoFactor),
        });
      } catch {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key) => () => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setError("");
    try {
      await api.put("/api/admin/settings", settings);
      setSuccess(true);
    } catch {
      setError("Failed to save settings.");
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Settings
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleToggle("notifications")}
                  color="primary"
                />
              }
              label="Enable Notifications"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={handleToggle("darkMode")}
                  color="primary"
                />
              }
              label="Dark Mode"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactor}
                  onChange={handleToggle("twoFactor")}
                  color="primary"
                  disabled 
                />
              }
              label="Enable Two-Factor Authentication"
            />
          </Grid>
        </Grid>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
        <Snackbar
          open={success}
          autoHideDuration={2000}
          onClose={() => setSuccess(false)}
          message="Settings saved!"
        />
      </Paper>
    </Box>
  );
};

export default Settings;