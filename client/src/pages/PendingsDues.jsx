import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../services/authService";

const PendingsDues = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editing, setEditing] = useState(null);
  const [info, setInfo] = useState("");

  const fetchDues = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/dues");
      setDues(res.data);
    } catch (e) {
      setInfo("Failed to load dues");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDues();
  }, []);

  const handleOpenDialog = (due = null) => {
    if (due) {
      setEditing(due._id);
      setAmount(due.amount);
      setUnit(due.unit);
      setDueDate(due.dueDate ? due.dueDate.substr(0, 10) : "");
    } else {
      setEditing(null);
      setAmount("");
      setUnit("");
      setDueDate("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditing(null);
    setAmount("");
    setUnit("");
    setDueDate("");
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/api/dues/${editing}`, { amount, unit, dueDate });
        setInfo("Due updated!");
      } else {
        await api.post("/api/dues", { amount, unit, dueDate });
        setInfo("Due added!");
      }
      fetchDues();
      handleCloseDialog();
    } catch (e) {
      setInfo("Failed to save due");
    }
  };

  const handleDelete = async (due) => {
    if (!window.confirm("Delete this due?")) return;
    try {
      await api.delete(`/api/dues/${due._id}`);
      setInfo("Due deleted.");
      fetchDues();
    } catch (e) {
      setInfo("Failed to delete due");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pending Dues
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
      >
        Add Due
      </Button>
      {info && <Typography color="primary" sx={{ mb: 2 }}>{info}</Typography>}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Unit</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No dues found.
                  </TableCell>
                </TableRow>
              ) : (
                dues.map((due) => (
                  <TableRow key={due._id}>
                    <TableCell>{due.unit}</TableCell>
                    <TableCell>{due.amount}</TableCell>
                    <TableCell>
                      {due.dueDate
                        ? new Date(due.dueDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog(due)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(due)}>
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
        <DialogTitle>{editing ? "Edit Due" : "Add Due"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            type="number"
          />
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!unit || !amount || !dueDate}>
            {editing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingsDues;