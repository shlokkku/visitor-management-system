import React from 'react';
import styled from 'styled-components';
import Button from './Button'; // Import the Button component

const SignIn = () => {
  return (
    <StyledWrapper>
      <form className="form">
        <p className="title">Sign In</p>
        <p className="message">Sign in to your account</p>
        <label>
          <input className="input" type="email" placeholder required />
          <span>Email</span>
        </label>
        <label>
          <input className="input" type="password" placeholder required />
          <span>Password</span>
        </label>
        <button className="submit">Sign In</button>
        <Button /> {/* Add the Button component here */}
        <p className="signup">Don't have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
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
    color: #1B0B2C;
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

export default SignIn;