import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress,
  InputAdornment, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "../services/authService";

const PendingsDues = () => {
  const [dues, setDues] = useState([]);
  const [filteredDues, setFilteredDues] = useState([]);
  const [loading, setLoading] = useState(false);

  // Residents for dropdown
  const [residents, setResidents] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editing, setEditing] = useState(null);
  const [info, setInfo] = useState("");
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchDues();
    fetchResidents();
  }, []);

  // Fetch dues from backend
  const fetchDues = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/dues");
      setDues(Array.isArray(res.data) ? res.data : []);
      setFilteredDues(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setDues([]);
      setFilteredDues([]);
      setInfo("Failed to load dues");
    }
    setLoading(false);
  };

  // Fetch residents for dropdown
  const fetchResidents = async () => {
    try {
      const res = await api.get("/api/residents");
      // Use res.data.data for array
      setResidents(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (e) {
      setResidents([]);
    }
  };

  // Filter dues when search text changes
  useEffect(() => {
    if (!search.trim()) {
      setFilteredDues(dues);
    } else {
      const lower = search.toLowerCase();
      setFilteredDues(
        dues.filter(
          d =>
            ((d.wing && d.flat_number && `${d.wing}-${d.flat_number}`.toLowerCase().includes(lower)) ||
            (d.full_name && d.full_name.toLowerCase().includes(lower)) ||
            (d.amount && d.amount.toString().includes(lower)) ||
            (d.due_date && new Date(d.due_date).toLocaleDateString().includes(lower)))
        )
      );
    }
  }, [search, dues]);

  // Open dialog for add or edit
  const handleOpenDialog = (due = null) => {
    if (due) {
      setEditing(due.id);
      // Find tenantId from residents by matching name/wing/flat (id is unique)
      setTenantId(due.id);
      setAmount(due.amount || "");
      setDueDate(
        due.due_date
          ? due.due_date.substr(0, 10)
          : ""
      );
    } else {
      setEditing(null);
      setTenantId("");
      setAmount("");
      setDueDate("");
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTenantId("");
    setAmount("");
    setDueDate("");
    setEditing(null);
  };

  // Save due (add or edit)
  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/api/dues/${editing}`, {
          amount,
          due_date: dueDate,
        });
        setInfo("Due updated!");
      } else {
        await api.post("/api/dues", {
          tenantId,
          amount,
          due_date: dueDate,
        });
        setInfo("Due added!");
      }
      fetchDues();
      handleCloseDialog();
    } catch (e) {
      setInfo("Failed to save due");
    }
  };

  // Delete due
  const handleDelete = async (due) => {
    if (!window.confirm("Delete this due?")) return;
    try {
      await api.delete(`/api/dues/${due.id}`);
      setInfo("Due deleted.");
      fetchDues();
    } catch (e) {
      setInfo("Failed to delete due");
    }
  };

  // Utility to build a unique key for each due (avoid duplicate key warning)
  const getDueKey = (due, idx) => {
    return `${due.id || ''}-${due.wing || ''}-${due.flat_number || ''}-${idx}`;
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 5, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pending Dues
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          placeholder="Search dues (unit, resident, amount, date...)"
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
          Add Due
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
                <TableCell>Unit</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due By</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No dues found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDues.map((due, idx) => (
                  <TableRow key={getDueKey(due, idx)}>
                    <TableCell>
                      {due.wing && due.flat_number
                        ? `${due.wing}-${due.flat_number}`
                        : ""}
                    </TableCell>
                    <TableCell>{due.full_name || ""}</TableCell>
                    <TableCell>{due.amount}</TableCell>
                    <TableCell>
                      {due.due_date
                        ? new Date(due.due_date).toLocaleDateString()
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Resident</InputLabel>
            <Select
              value={tenantId}
              label="Resident"
              onChange={e => setTenantId(e.target.value)}
              disabled={!!editing} // Do not allow resident change on edit
              displayEmpty
            >
              {Array.isArray(residents) && residents.length > 0 ? (
                residents.map(r => (
                  <MenuItem key={r.id} value={r.id}>
                    {`${r.wing}-${r.flat_number} (${r.full_name}${r.role ? `, ${r.role}` : ""})`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No residents found
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Due By"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!tenantId || !amount || !dueDate}>
            {editing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingsDues;