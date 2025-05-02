import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { logout } from '../services/authService';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <StyledNav>
      <div className="nav-content">
        <div className="nav-left">
          <h1>Society Management System</h1>
        </div>
        <div className="nav-right">
          <span className="user-info">
            Welcome, {user.name || user.email}
            {user.mfaEnabled && <span className="mfa-badge" title="MFA Enabled">🔒</span>}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .nav-left h1 {
    font-size: 1.5rem;
    color: royalblue;
    margin: 0;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mfa-badge {
    font-size: 1.2rem;
    cursor: help;
  }

  .logout-btn {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #c82333;
    }
  }
`;

export default Navbar;
