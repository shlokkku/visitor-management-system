import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const API_URL = '/api/residents'; 

const TenantManagement = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newResident, setNewResident] = useState({
    full_name: '',
    wing: '',
    flat_number: '',
    role: 'Owner',
    dues_amount: '',
    dues_type: 'Water Bill',
    contact_info: ''
  });
  const [searchQuery, setSearchQuery] = useState(''); 
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

 
  const fetchResidents = async (page = 1, limit = 10, query = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
  
      if (!token) {
        setError('No token found, please log in again.');
        setLoading(false);
        return;
      }
  
      const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}&search=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      const fetchedResidents = response.data?.data || [];
      setResidents(fetchedResidents);
      setPagination({ page, limit });
      setTotalPages(Math.ceil(response.data.pagination.totalResidents / limit));
      setError(null);
    } catch (err) {
      setError('Failed to fetch residents');
      setResidents([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchResidents(pagination.page, pagination.limit, searchQuery);
  }, [pagination.page, pagination.limit, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResident({
      ...newResident,
      [name]: value
    });
  };

  const handleAddResident = async () => {
    try {
      const payload = {
        full_name: newResident.full_name,
        wing: newResident.wing,
        flat_number: newResident.flat_number,
        role: newResident.role,
        contact_info: newResident.contact_info,
        dues_amount: newResident.dues_amount,
        dues_type: newResident.dues_type
      };
      
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({ open: true, message: 'No token found, please log in again.', severity: 'error' });
        return;
      }

      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      });

      fetchResidents(pagination.page, pagination.limit);
      setSnackbar({ open: true, message: 'Resident added successfully', severity: 'success' });
      setNewResident({ full_name: '', wing: '', flat_number: '', role: 'Owner', dues_amount: '', dues_type: 'Water Bill', contact_info: '' });
      setOpenAddDialog(false);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to add resident', severity: 'error' });
    }
  };

  const handlePageChange = (event, value) => {
    fetchResidents(value, pagination.limit, searchQuery);
  };

  return (
    <Box sx={{ padding: 3, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ color: "black", fontWeight: "bold" }}>
          Resident Info
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 1, px: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <SearchIcon sx={{ color: '#2c3e50' }} />
            <TextField 
              variant="standard" 
              placeholder="Search residents..." 
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1 }}
            />
          </Box>
          <Button 
            variant="contained" 
            sx={{ bgcolor: "#2c3e50", "&:hover": { bgcolor: "#2c3e50" } }} 
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add Resident
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Wing</TableCell>
                <TableCell>Flat Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Dues</TableCell>
                <TableCell>Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {residents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell>{resident.full_name}</TableCell>
                  <TableCell>{resident.wing}</TableCell>
                  <TableCell>{resident.flat_number}</TableCell>
                  <TableCell>{resident.role}</TableCell>
                  <TableCell>{resident.dues_amount}</TableCell>
                  <TableCell>{resident.contact_info}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Pagination 
        count={totalPages} 
        page={pagination.page} 
        onChange={handlePageChange}
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
      />

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Resident</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" fullWidth name="full_name" value={newResident.full_name} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField label="Wing" fullWidth name="wing" value={newResident.wing} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField label="Flat Number" fullWidth name="flat_number" value={newResident.flat_number} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField label="Role" fullWidth name="role" value={newResident.role} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField label="Contact Info" fullWidth name="contact_info" value={newResident.contact_info} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField label="Dues Amount" fullWidth name="dues_amount" value={newResident.dues_amount} onChange={handleInputChange} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">Cancel</Button>
          <Button onClick={handleAddResident} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TenantManagement;
