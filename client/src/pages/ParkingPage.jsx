import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { api } from '../services/authService';

const PRIMARY_COLOR = "#2c3e50";
const SECONDARY_COLOR = "#3498db";
const LIGHT_BG = "rgba(52, 152, 219, 0.08)";

const ParkingPage = () => {
  // State for parking data and pagination
  const [parkingData, setParkingData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedParking, setSelectedParking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [availableSpots, setAvailableSpots] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState('');
  const [spotTypeFilter, setSpotTypeFilter] = useState('all');
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    fetchParking();
    // eslint-disable-next-line
  }, []);

  const fetchParking = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/parking/all');
      const data = res.data;
      const grouped = {};
      data.forEach(row => {
        const flatKey = `${row.wing} Wing ${row.flat_number}`;
        if (!grouped[flatKey]) {
          grouped[flatKey] = {
            id: row.resident_id,
            flatInfo: flatKey,
            ownerName: row.full_name,
            contactNumber: row.contact_number || '',
            vehicles: [],
            parkings: []
          };
        }
        if (row.vehicle_id) {
          grouped[flatKey].vehicles.push({
            id: row.vehicle_id,
            make: row.vehicle_make,
            model: row.vehicle_model,
            license_plate: row.license_plate,
            type: row.vehicle_type,
            color: row.color,
            spot_number: row.spot_number,
            spot_type: row.spot_type
          });
        }
        if (row.spot_id) {
          grouped[flatKey].parkings.push({
            id: row.spot_id,
            number: row.spot_number,
            type: row.spot_type,
            is_primary: row.is_primary,
            is_assigned: row.is_assigned,
            assigned_vehicle_id: row.assigned_vehicle_id
          });
        }
      });

      const parkingRows = Object.values(grouped).map(flat => {
        const typeCount = {};
        flat.vehicles.forEach(v => {
          const key = v.type + ' wheeler';
          typeCount[key] = (typeCount[key] || 0) + 1;
        });
        const vehicleDetails = Object.entries(typeCount)
          .map(([type, count]) => `${type} x ${count}`)
          .join(', ') || '—';

        return {
          id: flat.id,
          flatInfo: flat.flatInfo,
          vehicles: flat.vehicles.length,
          parkingNo: flat.parkings.map(p => p.number).join(', ') || '—',
          vehicleDetails,
          ownerName: flat.ownerName,
          contactNumber: flat.contactNumber,
          vehiclesList: flat.vehicles,
          parkingsList: flat.parkings
        };
      });

      setParkingData(parkingRows);
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSpots = async (type = 'all', assigned = false) => {
    let url = '/api/parking/spots?';
    if (type !== 'all') url += `type=${type}&`;
    url += `assigned=${assigned ? 'true' : 'false'}`;
    try {
      const res = await api.get(url);
      setAvailableSpots(res.data || []);
    } catch (err) {
      setAvailableSpots([]);
      setSnackbar({ open: true, message: 'Failed to fetch available spots', severity: 'error' });
    }
  };

  const handleAssignSpot = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedSpotId('');
    fetchAvailableSpots(spotTypeFilter, true);
    setAssignDialogOpen(true);
  };

  const handleSpotTypeFilter = (event) => {
    const value = event.target.value;
    setSpotTypeFilter(value);
    fetchAvailableSpots(value, true);
  };

  const handleSubmitAssignSpot = async () => {
    if (!selectedSpotId || !selectedVehicle) return;
    try {
      await api.post('/api/parking/assign-spot', {
        spot_id: selectedSpotId,
        vehicle_id: selectedVehicle.id
      });
      setSnackbar({ open: true, message: 'Assigned spot successfully!', severity: 'success' });
      setAssignDialogOpen(false);
      fetchParking();
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.message || 'Failed to assign spot', severity: 'error' });
    }
  };

  const handleAvailableFilter = async (e) => {
    setAvailableOnly(e.target.value === "available");
    let type = spotTypeFilter;
    let assigned = e.target.value === "available";
    await fetchAvailableSpots(type, assigned);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetails = (parking) => setSelectedParking(parking);
  const handleCloseDetails = () => setSelectedParking(null);

  const filteredParkingData = spotTypeFilter === 'all'
    ? parkingData
    : parkingData.filter(flat =>
        flat.parkingsList && flat.parkingsList.some(spot => spot.type === spotTypeFilter)
      );

  const paginatedData = filteredParkingData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3, height: '100%', minHeight: '100vh', overflow: 'hidden', backgroundColor: '#fff' }}>
      <Paper 
        elevation={1} 
        sx={{ 
          height: "100%", 
          borderRadius: 2, 
          padding: 2,
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: 3
          },
          bgcolor: "#fff",
          borderTop: `3px solid ${SECONDARY_COLOR}`,
          overflow: 'visible'
        }}
      >
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            mb: 2, 
            fontWeight: "normal", 
            color: PRIMARY_COLOR 
          }}
        >
          Parking Information
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Spot Type</InputLabel>
            <Select
              value={spotTypeFilter}
              label="Spot Type"
              onChange={(e) => { setSpotTypeFilter(e.target.value); }}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="regular">Regular</MenuItem>
              <MenuItem value="extra">Extra</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 6, mb: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
        <CardContent sx={{ p: 0, overflow: 'visible' }}>
          <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none', overflow: 'visible' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['Flat Info', 'No. of Vehicles', 'Parking No', 'Vehicle Details', 'Actions'].map((header) => (
                    <TableCell 
                      key={header} 
                      align={header === 'Flat Info' ? 'left' : 'right'}
                      sx={{ 
                        color: PRIMARY_COLOR, 
                        fontWeight: 'bold',
                        backgroundColor: 'transparent'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow 
                    key={row.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: LIGHT_BG,
                      }
                    }}
                  >
                    {[
                      { key: 'flatInfo', align: 'left' },
                      { key: 'vehicles', align: 'right' },
                      { key: 'parkingNo', align: 'right' },
                      { key: 'vehicleDetails', align: 'right' }
                    ].map((col) => (
                      <TableCell 
                        key={col.key} 
                        align={col.align}
                        sx={{ 
                          color: PRIMARY_COLOR,
                          backgroundColor: 'transparent'
                        }}
                      >
                        <Typography sx={{ color: PRIMARY_COLOR }}>
                          {row[col.key]}
                        </Typography>
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleOpenDetails(row)}
                        sx={{
                          color: SECONDARY_COLOR,
                          borderColor: SECONDARY_COLOR,
                          '&:hover': {
                            backgroundColor: LIGHT_BG,
                            borderColor: SECONDARY_COLOR,
                          }
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredParkingData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-select, & .MuiTablePagination-displayedRows': {
                color: PRIMARY_COLOR
              },
              backgroundColor: 'transparent'
            }}
          />
        </CardContent>
        )}
      </Paper>

      {/* Detailed View Dialog */}
      <Dialog 
        open={!!selectedParking} 
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderTop: `3px solid ${SECONDARY_COLOR}`,
            borderRadius: 2,
            backgroundColor: '#fff'
          }
        }}
      >
        {selectedParking && (
          <>
            <DialogTitle sx={{ color: PRIMARY_COLOR }}>Parking Details</DialogTitle>
            <DialogContent>
              {[
                { label: "Flat Info", value: selectedParking.flatInfo },
                { label: "Owner Name", value: selectedParking.ownerName },
                { label: "Contact Number", value: selectedParking.contactNumber }
              ].map((field) => (
                <TextField
                  key={field.label}
                  margin="dense"
                  label={field.label}
                  fullWidth
                  variant="outlined"
                  value={field.value}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      color: PRIMARY_COLOR,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: SECONDARY_COLOR,
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: {
                      color: PRIMARY_COLOR
                    }
                  }}
                />
              ))}

              {/* Vehicles Table */}
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ color: PRIMARY_COLOR, fontWeight: 'bold', mb: 1 }}>Vehicles</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Plate</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Make/Model</TableCell>
                      <TableCell>Color</TableCell>
                      <TableCell>Assigned Spot</TableCell>
                      <TableCell>Assign</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedParking.vehiclesList?.length > 0 ? selectedParking.vehiclesList : []).map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>{v.license_plate}</TableCell>
                        <TableCell>{v.type}</TableCell>
                        <TableCell>{v.make} {v.model}</TableCell>
                        <TableCell>{v.color}</TableCell>
                        <TableCell>{v.spot_number || '—'}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            sx={{
                              backgroundColor: SECONDARY_COLOR,
                              color: "#fff",
                              minWidth: 90
                            }}
                            onClick={() => handleAssignSpot(v)}
                          >
                            Assign
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!selectedParking.vehiclesList || selectedParking.vehiclesList.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No vehicles</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
              {/* Parkings Table */}
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ color: PRIMARY_COLOR, fontWeight: 'bold', mb: 1 }}>Parking Spots</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Spot Number</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Primary</TableCell>
                      <TableCell>Assigned</TableCell>
                      <TableCell>Assigned Vehicle</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedParking.parkingsList?.length > 0 ? selectedParking.parkingsList : []).map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.number}</TableCell>
                        <TableCell>{p.type}</TableCell>
                        <TableCell>{p.is_primary ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{p.is_assigned ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{p.assigned_vehicle_id || '—'}</TableCell>
                      </TableRow>
                    ))}
                    {(!selectedParking.parkingsList || selectedParking.parkingsList.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No parking spots</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDetails} 
                sx={{
                  color: SECONDARY_COLOR,
                  '&:hover': {
                    backgroundColor: LIGHT_BG,
                  }
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Assign Spot Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderTop: `3px solid ${SECONDARY_COLOR}`,
            borderRadius: 2,
            backgroundColor: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ color: PRIMARY_COLOR }}>Assign Parking Spot</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Assigning to vehicle: <strong>{selectedVehicle?.license_plate}</strong>
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Spot Type</InputLabel>
            <Select
              value={spotTypeFilter}
              label="Spot Type"
              onChange={handleSpotTypeFilter}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="regular">Regular</MenuItem>
              <MenuItem value="extra">Extra</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Spot</InputLabel>
            <Select
              value={selectedSpotId}
              label="Spot"
              onChange={e => setSelectedSpotId(e.target.value)}
            >
              {availableSpots.length === 0 && (
                <MenuItem value="" disabled>No spots available</MenuItem>
              )}
              {availableSpots.map((spot) => (
                <MenuItem key={spot.id} value={spot.id}>
                  {spot.spot_number} ({spot.spot_type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAssignDialogOpen(false)}
            sx={{
              color: PRIMARY_COLOR
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitAssignSpot}
            variant="contained"
            sx={{
              backgroundColor: SECONDARY_COLOR,
              color: "#fff"
            }}
            disabled={!selectedSpotId}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar 
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParkingPage;