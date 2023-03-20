import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import Auth from "./Auth";

const App = () => {
  const [username, setUsername] = useState(null);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleRegister = async (username, password) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setUsername(username);
        localStorage.setItem("username", username);
      } else {
        console.error("Registration failed");
        handleError("Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      handleError(error.message);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(username);
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.token);
      } else {
        const data = await response.json();
        handleError(data.message);
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      handleError("Login failed");
    }
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setShowError(true);
  };

  const closeError = () => {
    setError("");
    setShowError(false);
  };

  return (
    <div>
      {username ? (
        <Chat username={username} onLogout={handleLogout} />
      ) : (
        <Auth
          onRegister={(username, password) =>
            handleRegister(username, password)
          }
          onLogin={(username, password) => handleLogin(username, password)}
        />
      )}
      {showError && (
        <div className="error-overlay">
          <div className="error-box">
            <h2 className="error-title">Error</h2>
            <p>{error}</p>
            <button onClick={closeError} className="error-close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
