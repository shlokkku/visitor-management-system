import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value.trim(); // Trim whitespace
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const name = `${formData.firstname} ${formData.lastname}`;
    const email = formData.email;
    const password = formData.password;

    try {
      setLoading(true);
      const data = await signup(name, email, password); // Call signup API
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/signin'), 2000); // Redirect to sign-in page
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="flex">
          <label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Firstname"
              required
            />
          </label>
          <label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Lastname"
              required
            />
          </label>
        </div>
        <label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </label>
        <label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </label>
        <label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <Button />
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

  .message, .signin {
    color: rgba(88, 87, 87, 0.822);
    font-size: 16px;
    text-align: center;
  }

  .signin a {
    color: royalblue;
  }

  .signin a:hover {
    text-decoration: underline royalblue;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 36px;
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

  .password-requirements {
    font-size: 0.8em;
    color: red;
    margin-top: -5px;
    margin-bottom: 5px;
  }

  .error-message {
    color: red;
    font-size: 14px;
    text-align: center;
  }

  .success-message {
    color: #388e3c;
    font-size: 14px;
    text-align: center;
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

  .submit:disabled {
    background-color: #b0b0b0;
    cursor: not-allowed;
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

export default Signup;