import axios from 'axios';

// Change this to match your backend server URL
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies to be set properly
});

/**
 * Sign in admin with email and password
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise} Promise with admin data
 */
export const signin = async (email, password) => {
  try {
    console.log('Signin Payload:', { email, password }); // Debugging log
    const response = await api.post('/api/auth/admin/signin', { email, password });
    console.log('API Response:', response.data);

    // Store admin data in localStorage, including role
    if (response.data.admin) {
      localStorage.setItem('user', JSON.stringify(response.data.admin));
      console.log('Stored admin data:', response.data.admin);
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Sign up admin with name, email, and password
 * @param {string} name - Admin's full name
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise} Promise with admin data
 */
export const signup = async (name, email, password) => {
  try {
    console.log('Signup Payload:', { name, email, password }); // Debugging log
    const response = await api.post('/api/auth/admin/signup', {
      name,
      email,
      password,
    });

    // Store admin data in localStorage if needed
    if (response.data.admin) {
      localStorage.setItem('user', JSON.stringify(response.data.admin));
    }

    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Sign out admin
 * @returns {Promise} Promise with success message
 */
export const signout = async () => {
  try {
    const response = await api.post('/api/auth/signout');

    // Clear admin data from localStorage
    localStorage.removeItem('user');

    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get current authenticated admin
 * @returns {Object|null} Admin object or null if not authenticated
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    localStorage.removeItem('user');
    return null;
  }
};

/**
 * Check if admin is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export default {
  signin,
  signup,
  signout,
  getCurrentUser,
  isAuthenticated,
};