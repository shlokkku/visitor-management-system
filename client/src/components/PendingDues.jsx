import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { api } from '../services/authService'; // Make sure to import the Axios instance

const PendingDues = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const primaryColor = '#2c3e50';
  const secondaryColor = '#3498db';
  const lightBg = 'rgba(52, 152, 219, 0.08)';

  // Fetch dues data when the component mounts
  useEffect(() => {
    const fetchDues = async () => {
      try {
        const response = await api.get('/api/dues'); // Use your Axios instance to make the request
        console.log('Dues data:', response.data);
        setDues(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized access, redirecting to login...');
          window.location.href = '/login'; // Redirect to login if 401 occurs
        } else {
          console.error('Error fetching dues:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDues();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <Paper
      elevation={1}
      sx={{
        height: '100%',
        borderRadius: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s ease',
        '&:hover': { boxShadow: 3 },
        bgcolor: '#fff',
        borderTop: `3px solid ${secondaryColor}`,
      }}
    >
      <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'normal', color: primaryColor }}>
        Pending Dues
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          pr: 1,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#c1c1c1', borderRadius: '10px' },
        }}
      >
        {loading ? (
          <Typography>Loading...</Typography>
        ) : dues.length > 0 ? (
          dues.map((item) => (
            <Box
              key={item.id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 1,
                bgcolor: lightBg,
                border: `1px solid rgba(44, 62, 80, 0.1)`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': { boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderLeft: `3px solid ${secondaryColor}` },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" color="black" sx={{ fontWeight: 'bold' }}>
                  {item.wing && item.flat_number ? `${item.wing}-${item.flat_number}` : 'Unknown Wing/Flat'}
                </Typography>
                <Typography variant="body2" color="black">
                  {item.full_name ? `${item.full_name} (${item.role || 'Unknown Role'})` : 'Unknown Tenant'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" sx={{ color: 'black', fontWeight: 'bold' }}>
                  {item.amount ? `${item.amount} INR` : 'N/A INR'}
                </Typography>
                <Typography variant="caption" color="GrayText">
                  Due by: {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'Unknown Date'}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No pending dues available</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default PendingDues;
