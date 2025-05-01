
import React, { useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import { signin, googleSignIn } from "../services/authService";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginSuccess = (data) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    setError("");
    setTimeout(() => {
      navigate("/admin");
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signin(email, password);
      loginSuccess(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unauthorized Access. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (window.google && google.accounts) {
        // Check which Google API is available and use the appropriate method
        if (google.accounts.id) {
          // Use the newer Identity Services library
          google.accounts.id.initialize({
            client_id:
              "205529855533-7vo9apoceklaoav95kqfkhm51dnf4fab.apps.googleusercontent.com",
            callback: async (credentialResponse) => {
              try {
                // This response contains the id_token in the credential property
                const data = await googleSignIn(credentialResponse.credential);
                loginSuccess(data);
              } catch (error) {
                setError("Google sign in failed. Please try again.");
                console.error("Google Sign In Error:", error);
              }
            },
          });

          google.accounts.id.prompt();
        } else if (google.accounts.oauth2) {
          // Use the OAuth2 API
          const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id:
              "205529855533-7vo9apoceklaoav95kqfkhm51dnf4fab.apps.googleusercontent.com",
            scope: "email profile openid",
            callback: async (response) => {
              try {
                console.log("Google response:", response);

                // If using the OAuth 2.0 flow, you need to exchange the access_token
                // for an id_token on your server or use a separate endpoint

                // Create a form data object to send to your backend
                const formData = new FormData();
                formData.append("access_token", response.access_token);

                // Call a backend endpoint that will exchange the access_token for an id_token
                const exchangeResponse = await fetch(
                  "/api/auth/exchange-google-token",
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                const tokenData = await exchangeResponse.json();

                if (tokenData.id_token) {
                  const data = await googleSignIn(tokenData.id_token);
                  loginSuccess(data);
                } else {
                  setError("Failed to get ID token from server");
                }
              } catch (error) {
                setError("Google sign in failed. Please try again.");
                console.error("Google Sign In Error:", error);
              }
            },
          });

          tokenClient.requestAccessToken();
        } else {
          setError("Google authentication library not properly loaded");
        }
      } else {
        setError("Google authentication is not available");
      }
    } catch (error) {
      setError("Failed to initialize Google Sign In");
      console.error("Google Sign In Error:", error);
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
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Google Sign In Button */}
        <div className="google-button-container">
          <Button onClick={handleGoogleSignIn} />
        </div>

        <p className="signup">
          Do not have an account? <a href="/signup">Sign Up</a>
        </p>
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

  .message,
  .signup {
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
    color: #1b0b2c;
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

  .google-button-container {
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }
`;

export default SignIn;
