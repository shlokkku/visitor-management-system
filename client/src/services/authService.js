// services/authService.js
import axios from 'axios';

const API_URL = '/api/auth'; // Adjust based on your API base URL

// Configure axios to include credentials (cookies)
axios.defaults.withCredentials = true;

export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const signin = async (email, password) => {
  const response = await axios.post(`${API_URL}/signin`, { email, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const signout = async () => {
  await axios.post(`${API_URL}/signout`);
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};