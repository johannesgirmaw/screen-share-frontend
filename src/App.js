import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import SenderSettings from "./components/SenderSettings";
import RecipientStartShare from "./components/RecipientStartShare";
import SenderConnect from "./components/SenderConnect";
import ScreenShareViewer from "./components/ScreenShareViewer";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Assuming AuthContext

function AuthStatus() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div>
      {user ? (
        <span>
          Welcome, {user.email} <button onClick={handleLogout}>Logout</button>
        </span>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Wrap the app with AuthProvider */}
        <nav>
          <ul>
            <li>
              <Link to="/sender-settings">Sender Settings</Link>
            </li>
            <li>
              <Link to="/recipient-start">Recipient Start Share</Link>
            </li>
            <li>
              <Link to="/sender-connect">Sender Connect</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/sender-settings" element={<SenderSettings />} />
          <Route path="/recipient-start" element={<RecipientStartShare />} />
          <Route path="/sender-connect" element={<SenderConnect />} />
          <Route path="/screen-share/" element={<ScreenShareViewer />} />
          <Route path="/" element={<h1>Welcome to Screen Share</h1>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
