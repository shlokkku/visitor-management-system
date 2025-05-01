import axios from 'axios';

const API_URL = '/api/parking';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <--- Important if using cookies!
});

// Add a request interceptor to always set the latest Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // get fresh token every time
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Now define services

// Get all parking records with pagination
const getParkingRecords = async (page = 1, limit = 5) => {
  try {
    const params = new URLSearchParams({ page, limit });
    console.log(`[getParkingRecords] Fetching records - Page: ${page}, Limit: ${limit}`);
    const response = await api.get(`?${params.toString()}`);
    console.log('[getParkingRecords] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getParkingRecords] Error fetching parking records:', error.response?.data || error.message);
    throw error;
  }
};

// Get single parking record
const getParkingRecord = async (id) => {
  try {
    console.log(`[getParkingRecord] Fetching record with ID: ${id}`);
    const response = await api.get(`/${id}`);
    console.log('[getParkingRecord] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getParkingRecord] Error fetching parking record:', error.response?.data || error.message);
    throw error;
  }
};

// Create new parking record (admin only)
const createParkingRecord = async (parkingData) => {
  try {
    console.log('[createParkingRecord] Creating new parking record with data:', parkingData);
    const response = await api.post('/', parkingData);
    console.log('[createParkingRecord] Created record:', response.data);
    return response.data;
  } catch (error) {
    console.error('[createParkingRecord] Error creating parking record:', error.response?.data || error.message);
    throw error;
  }
};

const parkingService = {
  getParkingRecords,
  getParkingRecord,
  createParkingRecord
};

export default parkingService;