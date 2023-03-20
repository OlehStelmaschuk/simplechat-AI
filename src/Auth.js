import React, { useState } from "react";
import "./styles/tailwindComponents.css";

const Auth = ({ onRegister, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="auth-container">
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-red-600 font-bold mb-4">Error</h2>
            <p className="mb-4">{errorMessage}</p>
            <button
              className="w-full bg-red-500 text-white font-bold rounded-lg px-4 py-2 shadow-md hover:bg-red-600"
              onClick={handleCloseError}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="auth-box">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button
          onClick={() => onRegister(username, password)}
          className="auth-button"
        >
          Register
        </button>
        <button
          onClick={() => onLogin(username, password)}
          className="auth-button"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Auth;
