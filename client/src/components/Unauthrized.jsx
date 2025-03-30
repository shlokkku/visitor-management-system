import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>Unauthorized Access</h1>
      <p>You don't have permission to access this page.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/dashboard" style={{ 
          marginRight: '10px',
          padding: '8px 16px',
          background: '#f0f0f0',
          textDecoration: 'none',
          borderRadius: '4px',
          color: '#333'
        }}>
          Go to Dashboard
        </Link>
        <Link to="/signin" style={{ 
          padding: '8px 16px',
          background: '#007bff',
          textDecoration: 'none',
          borderRadius: '4px',
          color: 'white'
        }}>
          Sign In with Different Account
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;