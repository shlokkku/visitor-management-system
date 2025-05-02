import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; 


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');// Redirect to login page
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
    localStorage.setItem('user', JSON.stringify(response.data.admin)); 
    localStorage.setItem('token', response.data.token); 
  }
  return response.data;
};


export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/login'; 
};

export default { signup, signin, logout };