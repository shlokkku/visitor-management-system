import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
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
  TextField
} from '@mui/material';

// Professional color scheme
const PRIMARY_COLOR = "#2c3e50"; // Dark blue/slate
const SECONDARY_COLOR = "#3498db"; // Bright blue accent
const LIGHT_BG = "rgba(52, 152, 219, 0.08)"; // Very light blue background

// Static mock data 
const INITIAL_PARKING_DATA = [
  { 
    id: 1,
    flatInfo: 'A Wing 101', 
    vehicles: 4, 
    parkingNo: 'A101', 
    vehicleDetails: '2 wheeler x 4',
    ownerName: 'John Doe',
    contactNumber: '9876543210'
  },
  { 
    id: 2,
    flatInfo: 'A Wing 102', 
    vehicles: 2, 
    parkingNo: 'A102', 
    vehicleDetails: '4 wheeler x 1, 2 wheeler x 1',
    ownerName: 'Jane Smith',
    contactNumber: '9876543211'
  },
  { 
    id: 3,
    flatInfo: 'A Wing 104', 
    vehicles: 1, 
    parkingNo: 'A104', 
    vehicleDetails: '2 wheeler x 1',
    ownerName: 'Alice Johnson',
    contactNumber: '9876543212'
  },
  { 
    id: 4,
    flatInfo: 'A Wing 201', 
    vehicles: 1, 
    parkingNo: 'A201', 
    vehicleDetails: '4 wheeler x 1',
    ownerName: 'Bob Williams',
    contactNumber: '9876543213'
  },
  { 
    id: 5,
    flatInfo: 'A Wing 202', 
    vehicles: 2, 
    parkingNo: 'A202', 
    vehicleDetails: '2 wheeler x 2',
    ownerName: 'Charlie Brown',
    contactNumber: '9876543214'
  }
];

const ParkingPage = () => {
  // State for parking data and pagination
  const [parkingData, setParkingData] = useState(INITIAL_PARKING_DATA);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // State for detailed view dialog
  const [selectedParking, setSelectedParking] = useState(null);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open detailed view dialog
  const handleOpenDetails = (parking) => {
    setSelectedParking(parking);
  };

  // Close detailed view dialog
  const handleCloseDetails = () => {
    setSelectedParking(null);
  };

  // Compute paginated data
  const paginatedData = parkingData.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto', backgroundColor: '#fff' }}>
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
          borderTop: `3px solid ${SECONDARY_COLOR}`
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

        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
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
            count={parkingData.length}
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
      </Paper>

      {/* Detailed View Dialog */}
      <Dialog 
        open={!!selectedParking} 
        onClose={handleCloseDetails}
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
        {selectedParking && (
          <>
            <DialogTitle sx={{ color: PRIMARY_COLOR }}>Parking Details</DialogTitle>
            <DialogContent>
              {[
                { label: "Flat Info", value: selectedParking.flatInfo },
                { label: "Parking Number", value: selectedParking.parkingNo },
                { label: "Owner Name", value: selectedParking.ownerName },
                { label: "Contact Number", value: selectedParking.contactNumber },
                { label: "Vehicle Details", value: selectedParking.vehicleDetails }
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
                  multiline={field.label === "Vehicle Details"}
                  rows={field.label === "Vehicle Details" ? 2 : 1}
                />
              ))}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDetails} 
                color="primary"
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
    </Box>
  );
};

export default ParkingPage;