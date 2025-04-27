import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { signin } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginSuccess = (data) => {
    // Store the token and user data if returned from the backend
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.admin) {
      localStorage.setItem('user', JSON.stringify(data.admin));
    }
    setError('');
    setTimeout(() => {
      navigate('/admin'); // Redirect to the admin dashboard
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await signin(email, password); // Call signin API
      loginSuccess(data); // Handle successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Unauthorized Access. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Sign In</p>
        <p className="message">Sign in to your account</p>
        
        {error && <p className="error-message">{error}</p>}
        
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
        
        <button className="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        
        <Button className="google-button" />
        
        <p className="signup">Do not have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 405px;
    max-width: 90%;
    background-color: #fff;
    padding: 50px;
    border-radius: 35px;
    position: relative;
    box-shadow: 40px 4px 105px rgba(0, 0, 0, 0.1);
  }

  .title {
    font-size: 28px;
    color: royalblue;
    font-weight: 600;
    text-align: center;
  }

  .message, .signup {
    color: rgba(88, 87, 87, 0.822);
    font-size: 16px;
    text-align: center;
  }

  .signup a {
    color: royalblue;
  }

  .signup a:hover {
    text-decoration: underline royalblue;
  }

  .form label {
    position: relative;
  }

  .input {
    width: 100%;
    padding: 20px 12px;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
    font-size: 16px;
    outline: none;
    transition: 0.3s ease;
  }

  .input + span {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: grey;
    font-size: 0.9em;
    transition: 0.3s ease;
    pointer-events: none;
  }

  .input:focus + span, 
  .input:valid + span {
    top: 12px;
    font-size: 0.6em;
    font-weight: 600;
    color: #1B0B2C;
  }

  .submit {
    border: none;
    background-color: royalblue;
    padding: 10px;
    border-radius: 100px;
    color: #fff;
    font-size: 16px;
    transition: 0.3s ease;
    cursor: pointer;
  }

  .submit:hover {
    background-color: rgb(56, 90, 194);
  }

  .error-message {
    color: red;
    font-size: 14px;
    text-align: center;
  }

  .google-button {
    cursor: pointer;
    color: black;
    display: flex;
    gap: 5px;
    align-items: center;
    background-color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.3s ease;
  }

  .google-button:hover {
    background-color: #e0e0e0;
  }

  .google-icon {
    width: 24px;
    height: 24px;
  }
`;

export default SignIn;