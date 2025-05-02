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
    console.log('Request intercepted:', config);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Handle responses with 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    // Only redirect for 401 errors, not for other errors like 403
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };

/**
 * Sign up admin
 */
export const signup = async (name, email, password) => {
  console.log('Signing up admin:', { name, email });
  const response = await api.post('/api/auth/admin/signup', { name, email, password });
  console.log('Signup response:', response.data);
  return response.data;
};

/**
 * Set up MFA for the current user
 */
export const setupMFA = async (userId) => {
  console.log('Setting up MFA for user:', userId);
  const response = await api.post('/api/auth/mfa/setup', { userId });
  console.log('MFA setup response:', response.data);
  return response.data;
};

/**
 * Verify MFA token
 */
export const verifyMFAToken = async (token, userId, isSetup = false) => {
  console.log('Verifying MFA token:', { userId, isSetup });
  const response = await api.post('/api/auth/mfa/verify', { token, userId, isSetup });
  console.log('MFA verification response:', response.data);
  return response.data;
};

/**
 * Sign in with MFA support
 */
export const signin = async (email, password, mfaToken = null) => {
  console.log('Signing in admin:', { email, hasMfaToken: !!mfaToken });
  try {
    const response = await api.post('/api/auth/admin/signin', { 
      email, 
      password,
      ...(mfaToken && { mfaToken })
    });
    
    const data = response.data;
    console.log('Signin response:', data);

    // If MFA is required and credentials are valid
    if (data.requireMFA && data.credentialsValid) {
      return {
        requireMFA: true,
        mfaEnabled: data.mfaEnabled,
        userId: data.userId,
        email,
        password,
        message: data.message
      };
    }

    // If login successful
    if (data.token && data.admin) {
      localStorage.setItem('user', JSON.stringify(data.admin));
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

/**
 * Log out admin
 */
export const logout = () => {
  console.log('Logging out admin');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default { signup, signin, logout, setupMFA, verifyMFAToken };