import React, { useState, useEffect } from 'react';
import { setupMFA, verifyMFAToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MFASetup = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initMFA = async () => {
      try {
        const response = await setupMFA();
        setQrCode(response.qrCode);
        setSecret(response.secret);
      } catch (err) {
        setError('Failed to initialize MFA setup. Please try again.');
      }
    };

    initMFA();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyMFAToken(token);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <div className="mfa-container">
        <h2>Set up Two-Factor Authentication</h2>
        <p>Scan this QR code with your authenticator app (e.g., Google Authenticator)</p>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">MFA setup successful! Redirecting to login...</p>}
        
        {qrCode && (
          <div className="qr-container">
            <img src={qrCode} alt="QR Code for MFA Setup" />
          </div>
        )}

        <div className="secret-container">
          <p>If you can't scan the QR code, enter this secret key manually:</p>
          <code>{secret}</code>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              Enter the verification code from your authenticator app:
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter 6-digit code"
                required
              />
            </label>
          </div>
          
          <button type="submit" disabled={loading || success}>
            {loading ? 'Verifying...' : 'Verify and Enable MFA'}
          </button>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;

  .mfa-container {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
  }

  h2 {
    color: #333;
    margin-bottom: 1rem;
    text-align: center;
  }

  .qr-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
    
    img {
      max-width: 200px;
      height: auto;
    }
  }

  .secret-container {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 2rem;
    
    code {
      display: block;
      word-break: break-all;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #e9ecef;
      border-radius: 4px;
    }
  }

  .input-group {
    margin-bottom: 1rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: royalblue;
        box-shadow: 0 0 0 2px rgba(65, 105, 225, 0.2);
      }
    }
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background-color: royalblue;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: rgb(56, 90, 194);
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  .error-message {
    color: #dc3545;
    margin: 1rem 0;
    text-align: center;
  }

  .success-message {
    color: #28a745;
    margin: 1rem 0;
    text-align: center;
  }
`;

export default MFASetup;