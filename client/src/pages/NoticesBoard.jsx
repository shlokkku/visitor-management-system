import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../services/authService";

const NoticesBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(null);
  const [info, setInfo] = useState("");

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/notices");
      setNotices(res.data);
    } catch (e) {
      setInfo("Failed to load notices");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenDialog = (notice = null) => {
    if (notice) {
      setEditing(notice._id);
      setTitle(notice.title);
      setMessage(notice.message);
    } else {
      setEditing(null);
      setTitle("");
      setMessage("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTitle("");
    setMessage("");
    setEditing(null);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/api/notices/${editing}`, { title, message });
        setInfo("Notice updated!");
      } else {
        await api.post("/api/notices", { title, message });
        setInfo("Notice added!");
      }
      fetchNotices();
      handleCloseDialog();
    } catch (e) {
      setInfo("Failed to save notice");
    }
  };

  const handleDelete = async (notice) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await api.delete(`/api/notices/${notice._id}`);
      setInfo("Notice deleted.");
      fetchNotices();
    } catch (e) {
      setInfo("Failed to delete notice");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Society Notice Board
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
      >
        Add Notice
      </Button>
      {info && <Typography color="primary" sx={{ mb: 2 }}>{info}</Typography>}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No notices found.
                  </TableCell>
                </TableRow>
              ) : (
                notices.map((notice) => (
                  <TableRow key={notice._id}>
                    <TableCell>{notice.title}</TableCell>
                    <TableCell>{notice.message}</TableCell>
                    <TableCell>
                      {notice.date
                        ? new Date(notice.date).toLocaleString()
                        : ""}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog(notice)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(notice)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? "Edit Notice" : "Add Notice"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!title || !message}>
            {editing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NoticesBoard;