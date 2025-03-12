// src/services/authService.js

import axios from 'axios';

// Change this to match your backend server URL
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for cookies to be set properly
});

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Promise with user data
 */
export const signin = async (email, password) => {
  try {
    const response = await api.post('/api/auth/signin', { email, password });
    
    // Store user data in localStorage if needed
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Sign up user with name, email, password and role
 * @param {string} name - User's full name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (default: 'staff')
 * @returns {Promise} Promise with user data
 */
export const signup = async (name, email, password, role = 'staff') => {
  try {
    const response = await api.post('/api/auth/signup', {
      name,
      email,
      password,
      role
    });
    
    // Store user data in localStorage if needed
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
 * Sign out user
 * @returns {Promise} Promise with success message
 */
export const signout = async () => {
  try {
    const response = await api.post('/api/auth/signout');
    
    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {Object|null} User object or null if not authenticated
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
 * Check if user is authenticated
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
  isAuthenticated
};