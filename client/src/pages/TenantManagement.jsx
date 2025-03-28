import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const TenantManagement = () => {
  const theme = useTheme();
  const [residents, setResidents] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newResident, setNewResident] = useState({
    flat: '',
    name: '',
    type: 'Rentee',
    dues: '',
    dueType: 'Water Bill'
  });

  useEffect(() => {
    setResidents([
      { 
        id: 1, 
        flat: 'A Wing 101', 
        name: 'Tom Cruise', 
        type: 'Rentee', 
        dues: '₹20,000',
        dueType: 'Water Bill'
      },
      { 
        id: 2, 
        flat: 'A Wing 102', 
        name: 'Matt Damon', 
        type: 'Owner', 
        dues: '₹5,000',
        dueType: 'Maintenance fees'
      },
      { 
        id: 3, 
        flat: 'A Wing 104', 
        name: 'Robert Downey', 
        type: 'Rentee', 
        dues: 'NA',
        dueType: ''
      },
      { 
        id: 4, 
        flat: 'A Wing 201', 
        name: 'Christian Bale', 
        type: 'Rentee', 
        dues: 'NA',
        dueType: ''
      },
      { 
        id: 5, 
        flat: 'A Wing 202', 
        name: 'Henry Cavil', 
        type: 'Owner', 
        dues: '₹30,000',
        dueType: 'Maintenance fees'
      }
    ]);
  }, []);

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

  const handleAddResident = () => {
    const newId = residents.length > 0 ? Math.max(...residents.map(r => r.id)) + 1 : 1;
    
    setResidents([
      ...residents,
      {
        id: newId,
        ...newResident
      }
    ]);
    
    // Reset form and close dialog
    setNewResident({
      flat: '',
      name: '',
      type: 'Rentee',
      dues: '',
      dueType: 'Water Bill'
    });
    setOpenAddDialog(false);
  };

  return (
    <Box sx={{ 
      padding: 3, 
      bgcolor: "#f8f9fa", 
      minHeight: "100vh" 
    }}>
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
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1 }}
            />
          </Box>
          
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: "#2c3e50", 
              "&:hover": { bgcolor: "#2c3e50" } 
            }} 
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add Resident
          </Button>
        </Box>
      </Box>

      <Paper sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        borderRadius: 2 
      }}>
        {/* Changed the black box to light blue */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #eee',
          bgcolor: '#e3f2fd' // Light blue color
        }}>
          <Typography variant="subtitle1" component="div" fontWeight="medium" sx={{ color: "#2c3e50" }}>
            All Residents
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              size="small"
              startIcon={<FilterListIcon />}
              sx={{ color: '#2c3e50' }}
            >
              Sort
            </Button>
            <Button
              size="small"
              sx={{ color: '#2c3e50' }}
            >
              Update
            </Button>
          </Box>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#e8f4fd' }}> {/* Light blue table header */}
              <TableRow>
                <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Flat Info</TableCell>
                <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Tenant Type</TableCell>
                <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Dues</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {residents.map((resident) => (
                <TableRow 
                  key={resident.id} 
                  sx={{ 
                    transition: 'transform 0.2s ease-in-out',
                    bgcolor: '#f0f8ff', // Same light blue for all rows
                    '&:hover': { 
                      transform: 'scale(1.01)',
                      bgcolor: '#cce5ff' // Slightly darker blue on hover
                    } 
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="div" 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          bgcolor: '#2c3e50',
                          color: 'white',
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {resident.name.charAt(0)}
                      </Box>
                      <Typography sx={{ color: "#2c3e50" }}> {/* Dark blue text for flat info */}
                        {resident.flat}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "#2c3e50" }}> {/* Dark blue text for name */}
                      {resident.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "#2c3e50" }}> {/* Dark blue text for tenant type */}
                      {resident.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {resident.dues !== 'NA' ? (
                      <Box>
                        <Typography variant="body2" sx={{ color: "#2c3e50", fontWeight: "medium" }}>{resident.dues}</Typography>
                        <Typography variant="caption" sx={{ color: "#2c3e50" }}> {/* Dark blue text for due type */}
                          {resident.dueType}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ color: "#2c3e50" }}>NA</Typography> 
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" sx={{ color: '#2c3e50' }}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Resident Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#f8f9fa", color: "#2c3e50" }}>Add New Resident</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="flat"
              label="Flat Info"
              fullWidth
              value={newResident.flat}
              onChange={handleInputChange}
            />
            
            <TextField
              name="name"
              label="Full Name"
              fullWidth
              value={newResident.name}
              onChange={handleInputChange}
            />
            
            <FormControl fullWidth>
              <InputLabel>Tenant Type</InputLabel>
              <Select
                name="type"
                value={newResident.type}
                label="Tenant Type"
                onChange={handleInputChange}
              >
                <MenuItem value="Rentee">Rentee</MenuItem>
                <MenuItem value="Owner">Owner</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              name="dues"
              label="Dues Amount"
              fullWidth
              value={newResident.dues}
              onChange={handleInputChange}
              placeholder="e.g. ₹10,000 or NA"
            />
            
            <FormControl fullWidth>
              <InputLabel>Due Type</InputLabel>
              <Select
                name="dueType"
                value={newResident.dueType}
                label="Due Type"
                onChange={handleInputChange}
              >
                <MenuItem value="Water Bill">Water Bill</MenuItem>
                <MenuItem value="Maintenance fees">Maintenance fees</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#f8f9fa" }}>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button 
            onClick={handleAddResident} 
            variant="contained" 
            sx={{ 
              bgcolor: "#2c3e50", 
              "&:hover": { bgcolor: "#1a252f" } 
            }}
            disabled={!newResident.flat || !newResident.name}
          >
            Add Resident
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantManagement;