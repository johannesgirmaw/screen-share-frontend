import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { screenShareService } from "../services/api";

function SenderConnect() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const url =
      "ws://localhost:8000/ws/screen-share/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiMTEiLCJyb2xlIjoic2VuZGVyIn0.8CgHNOY3UO4yRuwjdF1S1x6erro6vHH69THNohH0roc";

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
