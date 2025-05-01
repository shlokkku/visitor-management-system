import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Update with your backend server's URL

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header with the token for all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set token in headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses with 401 Unauthorized (e.g., expired or invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export { api };

/**
 * Sign up admin
 * @param {string} name - Admin's full name
 * @param {string} email - Admin's email
 * @param {string} password - Admin's password
 * @returns {Promise<Object>} Admin data on success
 */
export const signup = async (name, email, password) => {
  const response = await api.post('/api/auth/admin/signup', { name, email, password });
  return response.data;
};

/**
 * Sign in admin
 * @param {string} email - Admin's email
 * @param {string} password - Admin's password
 * @returns {Promise<Object>} Admin data and token on success
 */
export const signin = async (email, password) => {
  const response = await api.post('/api/auth/admin/signin', { email, password });
  if (response.data.admin) {
    localStorage.setItem('user', JSON.stringify(response.data.admin)); // Store user data
    localStorage.setItem('token', response.data.token); // Store token
  }
  return response.data;
};

/**
 * Sign in with Google
 * @param {string} credential - Google ID token
 * @returns {Promise<Object>} User data and JWT token on success
 */
export const googleSignIn = async (credential) => {
  const response = await api.post('/api/auth/google', { token: credential });
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/**
 * Log out admin
 */
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/login'; // Redirect to login page
};

export default { signup, signin, googleSignIn, logout };