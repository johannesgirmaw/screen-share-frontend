import React, { useState, useEffect } from "react";
import { userService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function SenderSettings() {
  const [canViewScreenShares, setCanViewScreenShares] = useState(false);
  const [message, setMessage] = useState("");
  const { user, setUser } = useAuth(); // Assuming user object has can_view_screen_shares

  useEffect(() => {
    if (user) {
      setCanViewScreenShares(user.can_view_screen_shares);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateUserSettings({
        can_view_screen_shares: canViewScreenShares,
      });
      setUser(updatedUser); // Update the user context
      setMessage("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage("Failed to update settings.");
    }
  };

  return (
    <div>
      <h2>Sender Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            checked={canViewScreenShares}
            onChange={(e) => setCanViewScreenShares(e.target.checked)}
          />
          Enable Screen Share Viewing
        </label>
        <br />
        <button type="submit">Apply Changes</button>
      </form>
      {message && <p>{message}</p>}
      {user && user.access_code && (
        <p>
          Your screen share access code: <strong>{user.access_code}</strong>{" "}
          (Share this with the recipient)
        </p>
      )}
    </div>
  );
}

export default SenderSettings;
