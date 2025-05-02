import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress, InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "../services/authService";

const NoticesBoard = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [editing, setEditing] = useState(null);
  const [info, setInfo] = useState("");
  const [search, setSearch] = useState("");

    const fetchNotices = async () => {
    setLoading(true);
    try {
      console.log("Fetching notices...");
      const res = await api.get("/api/notices");
      console.log("Notices fetched:", res.data);
      setNotices(res.data);
      setFilteredNotices(res.data);
    } catch (e) {
      console.error("Failed to fetch notices:", e.response?.status, e.response?.data);
      setInfo("Failed to load notices");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

 
  useEffect(() => {
    if (!search.trim()) {
      setFilteredNotices(notices);
    } else {
      const lower = search.toLowerCase();
      setFilteredNotices(
        notices.filter(
          n =>
            (n.title && n.title.toLowerCase().includes(lower)) ||
            (n.content && n.content.toLowerCase().includes(lower)) ||
            (n.date_posted && new Date(n.date_posted).toLocaleDateString().includes(lower)) ||
            (n.expiration_date && new Date(n.expiration_date).toLocaleDateString().includes(lower))
        )
      );
    }
  }, [search, notices]);

  const handleOpenDialog = (notice = null) => {
    if (notice) {
      setEditing(notice.id);
      setTitle(notice.title || "");
      setContent(notice.content || "");
      setExpirationDate(
        notice.expiration_date
          ? notice.expiration_date.substr(0, 10)
          : ""
      );
    } else {
      setEditing(null);
      setTitle("");
      setContent("");
      setExpirationDate("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTitle("");
    setContent("");
    setExpirationDate("");
    setEditing(null);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/api/notices/${editing}`, {
          title,
          content,
          expiration_date: expirationDate || null,
        });
        setInfo("Notice updated!");
      } else {
        await api.post("/api/notices", {
          title,
          content,
          expiration_date: expirationDate || null,
        });
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
      await api.delete(`/api/notices/${notice.id}`);
      setInfo("Notice deleted.");
      fetchNotices();
    } catch (e) {
      setInfo("Failed to delete notice");
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Society Notice Board
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          placeholder="Search notices (title, message, date...)"
          fullWidth
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Notice
        </Button>
      </Box>
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
                <TableCell>Date Posted</TableCell>
                <TableCell>Expires On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No notices found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell>{notice.title}</TableCell>
                    <TableCell>{notice.content}</TableCell>
                    <TableCell>
                      {notice.date_posted
                        ? new Date(notice.date_posted).toLocaleString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      {notice.expiration_date
                        ? new Date(notice.expiration_date).toLocaleDateString()
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
            onChange={e => setTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Message"
            value={content}
            onChange={e => setContent(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Expires On"
            type="date"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!title || !content}>
            {editing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NoticesBoard;