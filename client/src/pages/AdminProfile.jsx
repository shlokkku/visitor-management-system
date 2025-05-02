"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  Grid,
  TextField,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { api } from "../services/authService";
import { useOutletContext } from "react-router-dom";

const AdminProfile = () => {
  const { admin, setAdmin } = useOutletContext();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(!admin);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (admin) {
      setProfile({ name: admin.name, email: admin.email });
      setLoading(false);
    } else {
      setLoading(true);
      api.get("/api/admin/profile").then(res => {
        setAdmin(res.data);
        setProfile({ name: res.data.name, email: res.data.email });
      }).catch(() => {
        setError("Failed to load profile.");
      }).finally(() => setLoading(false));
    }
  }, [admin]);

  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    setError("");
    // Do not allow empty name
    if (!profile.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (profile.name.trim() === admin.name) {
      setEditMode(false);
      return;
    }
    setSaving(true);
    try {
      await api.put("/api/admin/profile", { name: profile.name });
      setAdmin({ ...admin, name: profile.name });
      setEditMode(false);
      setSuccess(true);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const isNameChanged = profile.name.trim() !== admin?.name;
  const isSaveDisabled = saving || !profile.name.trim() || !isNameChanged;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ width: 72, height: 72, mr: 2, bgcolor: "#3b82f6" }}>
            {admin?.name?.[0]?.toUpperCase() ?? "A"}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {admin?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {admin?.email}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight={500}>
              Admin
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={profile.name}
                disabled={!editMode}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                error={!!error && editMode}
                helperText={editMode && error ? error : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={profile.email}
                disabled
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            {!editMode ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
                disabled={isSaveDisabled}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </Box>
        </form>
        <Snackbar
          open={success}
          autoHideDuration={2000}
          onClose={() => setSuccess(false)}
          message="Profile updated!"
        />
      </Paper>
    </Box>
  );
};

export default AdminProfile;