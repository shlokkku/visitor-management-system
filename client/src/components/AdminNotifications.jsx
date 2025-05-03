import React, { useState, useEffect, useRef } from "react";
import { Box, Badge, IconButton, Popover, Typography, List, ListItem, ListItemText, CircularProgress, Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { io } from "socket.io-client";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const AdminNotifications = ({ admin, api }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

 
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data);
    } catch (e) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(notifications =>
        notifications.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch {}
  };


  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0) fetchNotifications();
  };
  const handleClose = () => setAnchorEl(null);


  useEffect(() => {
    if (!admin) return;
    socketRef.current = io(SOCKET_URL, { withCredentials: true });
  
    socketRef.current.emit("join-user", admin.id);

    socketRef.current.on("notification", (notif) => {
      setNotifications((prev) => [{ ...notif, is_read: false }, ...prev]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [admin]);


  useEffect(() => {
    fetchNotifications();

  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{ sx: { width: 360, maxHeight: 420, p: 0 } }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #eee", bgcolor: "#f6f8fa" }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Box sx={{ minHeight: 120, maxHeight: 340, overflowY: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : notifications.length === 0 ? (
            <Typography sx={{ p: 2, color: "#888" }}>No notifications</Typography>
          ) : (
            <List disablePadding>
              {notifications.map((notif) => (
                <ListItem
                  button
                  key={notif.id}
                  alignItems="flex-start"
                  onClick={() => {
                    if (!notif.is_read) handleMarkAsRead(notif.id);
                  }}
                >
                  {}
                  <Box sx={{ pr: 1, pt: 0.7 }}>
                    {!notif.is_read && (
                      <FiberManualRecordIcon fontSize="small" sx={{ color: "#22c55e" }} />
                    )}
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography fontWeight={notif.is_read ? 400 : 700}>
                          {notif.title}
                        </Typography>
                        {!notif.is_read && (
                          <Chip label="New" size="small" color="success" sx={{ ml: 0.5 }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#888" }}>
                          {formatDate(notif.created_at)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default AdminNotifications;
