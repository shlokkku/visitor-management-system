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
import SecurityIcon from "@mui/icons-material/Security";
import { api } from "../services/authService";
import MFASetup from "../components/MFASetup";

const defaultSettings = {
  notifications: true,
  darkMode: false,
  twoFactor: false,
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const mfaEnabled = user.mfaEnabled || false;

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/admin/settings");
        setSettings({
          notifications: Boolean(res.data.notifications),
          darkMode: Boolean(res.data.darkMode),
          twoFactor: typeof res.data.twoFactor === "undefined" ? mfaEnabled : Boolean(res.data.twoFactor),
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

  const handleMFASuccess = () => {
    const updatedUser = { ...user, mfaEnabled: true };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSettings((prev) => ({ ...prev, twoFactor: true }));
    setShowMFASetup(false);
    setSuccess(true);
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, bgcolor: "#f5f7fa" }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color: "#2c3e50", mb: 3 }}>
          Settings
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ color: "#2c3e50", mb: 2 }}>
          General Settings
        </Typography>
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
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <SecurityIcon sx={{ color: "#2c3e50", fontSize: 28, mr: 2 }} />
          <Box>
            <Typography variant="h6" sx={{ color: "#2c3e50" }}>
              Two-Factor Authentication
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add an extra layer of security to your account
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="body1" sx={{ color: "#2c3e50", mb: 0.5 }}>
              {mfaEnabled ? "MFA is enabled" : "MFA is disabled"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mfaEnabled
                ? "Your account is protected with two-factor authentication"
                : "Enable two-factor authentication for enhanced security"}
            </Typography>
          </Box>
          {!mfaEnabled && (
            <Button
              variant="contained"
              onClick={() => setShowMFASetup(true)}
              sx={{
                bgcolor: "#2c3e50",
                "&:hover": { bgcolor: "#1a252f" },
              }}
            >
              Set up MFA
            </Button>
          )}
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2c3e50" }}>
            Save Changes
          </Button>
        </Box>

        <Snackbar
          open={success}
          autoHideDuration={2000}
          onClose={() => setSuccess(false)}
          message="Settings saved!"
        />

        {showMFASetup && (
          <MFASetup onClose={() => setShowMFASetup(false)} onSuccess={handleMFASuccess} />
        )}
      </Paper>
    </Box>
  );
};

export default Settings;