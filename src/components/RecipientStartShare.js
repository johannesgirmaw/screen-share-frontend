import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { screenShareService } from "../services/api";

function RecipientStartShare() {
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
     token = "GET From API"
        const url =
          "ws://localhost:8000/ws/screen-share/?token=${token}";
      const role = "recipient";
      navigate(`/screen-share/`, {
        state: { url, role },
      });
    } catch (error) {
      console.error("Error starting screen share:", error);
      setMessage(
        "Failed to start screen share. Invalid code or sender not ready."
      );
    }
  };

  return (
    <div>
      <h2>Recipient: Start Screen Share</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Access Code:
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Start Screen Share</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RecipientStartShare;
