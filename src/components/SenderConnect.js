import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { screenShareService } from "../services/api";

function SenderConnect() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    token = "GET From API"
    const url =
      "ws://localhost:8000/ws/screen-share/?token=${token}";

    // The backend returns session_id, sender_token, role
    const role = "sender";
    // Redirect to the screen share viewer, passing relevant data
    navigate(`/screen-share/`, {
      state: { url, role },
    });
  };

  return (
    <div>
      <h2>Sender: Connect to Session</h2>
      <button onClick={handleSubmit}>Connect</button>
    </div>
  );
}

export default SenderConnect;
