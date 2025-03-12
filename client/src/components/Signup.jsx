import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button'; // Import the Button component
import axios from 'axios'; // You'll need to install axios: npm install axios

// Set the base URL for your API
// Change this to match your actual backend server address
const API_BASE_URL = 'http://localhost:5000'; // Typical Node.js/Express server port

const Signup = () => {
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for backend
      const userData = {
        name: `${formData.firstname} ${formData.lastname}`,
        email: formData.email,
        password: formData.password,
        role: 'staff' // Default role as per your backend
      };

      console.log('Sending signup request to:', `${API_BASE_URL}/api/auth/signup`);
      console.log('User data:', userData);

      // Send data to backend with the full URL
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Important for cookies to be set properly across domains
      });
      
      console.log('Signup response:', response.data);
      setSuccess('Registration successful! Redirecting to dashboard...');
      
      // Optional: Redirect after a delay
      setTimeout(() => {
        window.location.href = '/dashboard'; // Or use React Router's navigate
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Registration failed');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register </p>
        <p className="message">Sign up now and get full access to our app. </p>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        
        <div className="flex">
          <label>
            <input 
              className="input" 
              type="text" 
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="" 
              required 
            />
            <span>Firstname</span>
          </label>
          <label>
            <input 
              className="input" 
              type="text" 
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="" 
              required 
            />
            <span>Lastname</span>
          </label>
        </div>  
        <label>
          <input 
            className="input" 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="" 
            required 
          />
          <span>Email</span>
        </label> 
        <label>
          <input 
            className="input" 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="" 
            required 
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}" 
            title="Password must be at least 8 characters long, contain at least one digit, one lowercase letter, one uppercase letter, and one special character." 
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => setShowPasswordRequirements(false)}
          />
          <span>Password</span>
        </label>
        {showPasswordRequirements && (
          <p className="password-requirements">
            Password must be at least 8 characters long, contain at least one digit, one lowercase letter, one uppercase letter, and one special character.
          </p>
        )}
        <label>
          <input 
            className="input" 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="" 
            required 
          />
          <span>Confirm password</span>
        </label>
        <button className="submit" type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Submit'}
        </button>
        <Button /> {/* Add the Button component here */}
        <p className="signin">Already have an account? <a href="/signin">Sign In</a> </p>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Styling remains the same as before */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full screen height */
  background-color: #f5f5f5; /* Optional background */

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 405px;
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
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title::before, .title::after {
    display: none; /* Remove misplaced elements */
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

  .form label .input {
    width: 100%;
    padding: 20px 12px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
    font-size: 16px;
    transition: 0.3s ease;
    line-height: normal;
  }

  .form label .input + span {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: grey;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
    pointer-events: none;
  }

  .form label .input:focus + span, 
  .form label .input:valid + span {
    top: 12px;
    font-size: 0.6em;
    font-weight: 600;
    color: skyblue;
  }

  .password-requirements {
    font-size: 0.8em;
    color: red;
    margin-top: -10px;
    margin-bottom: 10px;
  }

  .error-message {
    color: #d32f2f;
    font-size: 0.9em;
    text-align: center;
    margin: 5px 0;
  }

  .success-message {
    color: #388e3c;
    font-size: 0.9em;
    text-align: center;
    margin: 5px 0;
  }

  .submit {
    border: none;
    outline: none;
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
    text-black;
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