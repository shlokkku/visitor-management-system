import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/visitorlogs';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch visitor logs for admin
 * @returns {Promise<Array>} List of visitor logs
 */
export const fetchVisitorLogs = async () => {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await api.get('/', {
      headers: { Authorization: `Bearer ${token}` }, 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor logs:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch visitor logs. Please try again later.'
    );
  }
};

/**
 * Fetch a single visitor log by ID
 * @param {string} id - Visitor log ID
 * @returns {Promise<Object>} The visitor log
 */
export const fetchVisitorLogById = async (id) => {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await api.get(`/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching visitor log with ID: ${id}`, error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch the visitor log. Please try again later.'
    );
  }
};

/**
 * Update visitor log status
 * @param {string} id - Visitor log ID
 * @param {Object} updateData - Data to update (e.g., { status, updated_by })
 * @returns {Promise<Object>} Updated visitor log
 */
export const updateVisitorLogStatus = async (id, updateData) => {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await api.put(`/${id}/status`, updateData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', 
      },
    });
    return response.data; 
  } catch (error) {
    console.error(`Error updating visitor log status with ID: ${id}`, error);
    throw new Error(
      error.response?.data?.message || 'Failed to update visitor log status. Please try again later.'
    );
  }
};

export default { fetchVisitorLogs, fetchVisitorLogById, updateVisitorLogStatus };
