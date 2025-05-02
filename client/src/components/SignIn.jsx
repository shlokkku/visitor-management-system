import React, { useState } from 'react';
import styled from 'styled-components';
import { signin, setupMFA, verifyMFAToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [requireMFA, setRequireMFA] = useState(false);
  const [setupMFAMode, setSetupMFAMode] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [userId, setUserId] = useState(null);
  const [storedCredentials, setStoredCredentials] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMFASetup = async (userId) => {
    try {
      setLoading(true);
      const data = await setupMFA(userId);
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setSetupMFAMode(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to setup MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (setupMFAMode) {
        // Verify the MFA token and enable MFA for the user
        await verifyMFAToken(mfaToken, userId, true);
        // After successful verification, try logging in again
        const loginData = await signin(
          storedCredentials.email,
          storedCredentials.password,
          mfaToken
        );
        if (loginData.token && loginData.admin) {
          // Store token and user
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('user', JSON.stringify(loginData.admin));
          navigate('/admin');
        }
        return;
      }

      // Regular login flow with MFA if needed
      const data = await signin(
        storedCredentials ? storedCredentials.email : email,
        storedCredentials ? storedCredentials.password : password,
        requireMFA ? mfaToken : null
      );
      
      // Handle MFA setup requirement
      if (data.requireMFA) {
        if (!data.mfaEnabled) {
          // Store credentials and start MFA setup
          setStoredCredentials({ email, password });
          setUserId(data.userId);
          await handleMFASetup(data.userId);
          return;
        }
        
        // MFA is enabled, need token verification
        setRequireMFA(true);
        setUserId(data.userId);
        setStoredCredentials({ email, password });
        setError(data.message || 'Please enter your authenticator code');
        setMfaToken('');
        return;
      }
      
      // Regular login success
      if (data.token && data.admin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.admin));
        navigate('/admin');
        return;
      }
      
      setError('Something went wrong. Please try again.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      
      if (errorMessage === 'Invalid MFA token') {
        setMfaToken(''); // Clear invalid token
      } else {
        // Reset form for other errors
        setRequireMFA(false);
        setSetupMFAMode(false);
        setStoredCredentials(null);
        setEmail('');
        setPassword('');
        setMfaToken('');
        setQrCode('');
        setSecret('');
        setUserId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Sign In</p>
        <p className="message">
          {setupMFAMode 
            ? 'Set up Two-Factor Authentication' 
            : requireMFA 
              ? 'Enter Authentication Code' 
              : 'Sign in to your account'}
        </p>
        
        {error && <p className="error-message">{error}</p>}
        
        {!requireMFA && !setupMFAMode ? (
          <>
            <label>
              <input 
                className="input" 
                type="email" 
                placeholder="" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span>Email</span>
            </label>
            
            <label>
              <input 
                className="input" 
                type="password" 
                placeholder="" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span>Password</span>
            </label>
          </>
        ) : (
          <>
            {setupMFAMode && (
              <div className="mfa-setup">
                <p>1. Scan this QR code with your authenticator app:</p>
                {qrCode && <img src={qrCode} alt="MFA QR Code" className="qr-code" />}
                
                <div className="secret-key">
                  <p>2. Or enter this code manually:</p>
                  <code>{secret}</code>
                </div>
                
                <p className="verification-text">3. Enter the verification code from your app:</p>
              </div>
            )}
            
            <label>
              <input 
                className="input" 
                type="text" 
                placeholder="Enter 6-digit code" 
                required 
                value={mfaToken}
                onChange={(e) => setMfaToken(e.target.value)}
                maxLength={6}
                pattern="[0-9]{6}"
              />
              <span>Authenticator Code</span>
            </label>
          </>
        )}
        
        <button className="submit" disabled={loading}>
          {loading 
            ? 'Please wait...' 
            : setupMFAMode 
              ? 'Verify and Enable MFA' 
              : requireMFA 
                ? 'Verify Code' 
                : 'Sign in'}
        </button>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;

  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 405px;
    max-width: 100%;
    background-color: #fff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .title {
    font-size: 28px;
    color: royalblue;
    font-weight: 600;
    text-align: center;
    margin-bottom: 10px;
  }

  .message {
    color: #666;
    font-size: 16px;
    text-align: center;
    margin-bottom: 20px;
  }

  label {
    position: relative;
    display: block;
    margin-bottom: 5px;
  }

  .input {
    width: 100%;
    padding: 12px;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: royalblue;
      outline: none;
    }
  }

  .submit {
    background-color: royalblue;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #2145cc;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  .error-message {
    color: #dc3545;
    text-align: center;
    font-size: 14px;
    margin: 10px 0;
  }

  .mfa-setup {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;

    p {
      margin: 10px 0;
      color: #495057;
    }

    .qr-code {
      display: block;
      max-width: 200px;
      height: auto;
      margin: 20px auto;
      padding: 10px;
      background: white;
      border-radius: 5px;
    }

    .secret-key {
      background-color: #e9ecef;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;

      code {
        display: block;
        word-break: break-all;
        margin-top: 5px;
        font-family: monospace;
        font-size: 14px;
        color: #495057;
        background: white;
        padding: 10px;
        border-radius: 4px;
      }
    }

    .verification-text {
      color: #0066cc;
      font-weight: 500;
      margin-top: 20px;
    }
  }

  .signup {
    text-align: center;
    margin-top: 20px;
    
    a {
      color: royalblue;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export default SignIn;