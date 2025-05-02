import React, { useEffect, useState, useCallback } from "react";
import { Snackbar, Alert, Slide, Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import io from "socket.io-client";

// Get your backend URL from env or config
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const alertTypeToColor = {
  fire: "error",
  security: "warning",
  medical: "info"
};

const AlertPopup = () => {
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  // Get user role from localStorage or context (assuming you store on login)
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;
  const userRole = user?.user_type || "Admin"; // fallback to Admin

  useEffect(() => {
    if (!userRole) return;

    const s = io(SOCKET_URL, { withCredentials: true });

    setSocket(s);
    s.on("connect", () => {
      s.emit("join-role", userRole);
    });

    s.on("new-alert", (alertData) => {
      setAlert(alertData);
      setOpen(true);
      // Optional: Play a sound
      // new Audio("/alert.mp3").play();
    });

    s.on("alert-resolved", ({ id }) => {
      if (alert && alert.id === id) setOpen(false);
    });

    return () => s.disconnect();
    // eslint-disable-next-line
  }, [userRole]);

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  }, []);

  if (!alert) return null;

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={SlideTransition}
      autoHideDuration={null}
      onClose={handleClose}
      sx={{ zIndex: 10000 }}
    >
      <Alert
        severity={alertTypeToColor[alert.type] || "info"}
        variant="filled"
        icon={false}
        sx={{
          width: "100%",
          alignItems: "flex-start",
          minWidth: 350,
          boxShadow: 4,
          backgroundColor:
            alert.type === "fire"
              ? "#d32f2f"
              : alert.type === "security"
              ? "#ed6c02"
              : "#0288d1",
          color: "#fff"
        }}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {alert.type === "fire"
              ? "🔥 Fire Emergency"
              : alert.type === "security"
              ? "🚨 Security Emergency"
              : "🩺 Medical Emergency"}
          </Typography>
          <Typography>
            <b>Unit:</b> {alert.unit}
          </Typography>
          {alert.resident && (
            <Typography>
              <b>Resident:</b> {alert.resident.full_name}
              {alert.resident.wing && alert.resident.flat_number
                ? ` (${alert.resident.wing}-${alert.resident.flat_number})`
                : ""}
            </Typography>
          )}
          {alert.message && (
            <Typography sx={{ mt: 1 }}>
              <b>Message:</b> {alert.message}
            </Typography>
          )}
          <Typography sx={{ mt: 1, fontSize: 12 }}>
            {new Date(alert.timestamp).toLocaleString()}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default AlertPopup;