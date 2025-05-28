import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { setupWebSocket } from "../services/websocket"; // Custom WebSocket service

function ScreenShareViewer() {
  const { sessionId } = useParams();
  const location = useLocation();
  const { url, role } = location.state || {}; // Get token and role from navigation state

  const localVideoRef = useRef(null); // For recipient's local screen stream
  const remoteVideoRef = useRef(null); // For sender to display recipient's screen
  const peerConnectionRef = useRef(null);
  const websocketRef = useRef(null);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    websocketRef.current = setupWebSocket(url);
    console.log(role, url);
    websocketRef.current.onopen = () => {
      setStatus("WebSocket connected.");
      console.log("WebSocket connected.");
      initializePeerConnection();
    };

    websocketRef.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket message received:", message.type);

      if (!peerConnectionRef.current) {
        initializePeerConnection(); // Ensure peer connection is set up
      }

      if (message.type === "offer") {
        if (role === "sender") {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(message)
          );
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          websocketRef.current.send(JSON.stringify(answer));
          setStatus("Offer received, sending answer.");
        }
      } else if (message.type === "answer") {
        if (role === "recipient") {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(message)
          );
          setStatus("Answer received.");
        }
      } else if (message.type === "candidate") {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(message.candidate)
          );
          console.log("ICE candidate added.");
        } catch (e) {
          console.error("Error adding received ICE candidate:", e);
        }
      } else if (message.type === "session_ended") {
        setStatus("Session ended by the other party.");
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
        }
        if (websocketRef.current) {
          websocketRef.current.close();
        }
      }
    };

    websocketRef.current.onclose = (event) => {
      console.log("WebSocket disconnected:", event);
      setStatus("WebSocket disconnected. Trying to reconnect...");
      // Implement a reconnection strategy if needed
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("WebSocket error occurred.");
    };

    const initializePeerConnection = () => {
      if (peerConnectionRef.current) return; // Prevent re-initialization

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // STUN server for NAT traversal
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          websocketRef.current.send(
            JSON.stringify({ type: "candidate", candidate: event.candidate })
          );
        }
      };

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setStatus("Screen stream received.");
        }
      };

      peerConnectionRef.current = pc;

      if (role === "recipient") {
        startScreenCapture(pc);
      }
    };

    const startScreenCapture = async (pc) => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // Create offer if recipient
        if (role === "recipient") {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          websocketRef.current.send(JSON.stringify(offer));
          setStatus("Screen sharing started, sending offer.");
        }
      } catch (err) {
        console.error("Error starting screen capture:", err);
        setStatus(
          "Failed to start screen capture. Make sure you grant permission."
        );
      }
    };

    return () => {
      // Cleanup on component unmount
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [role]);

  return (
    <div>
      <h2>Screen Share Session: {sessionId}</h2>
      <p>Role: {role}</p>
      <p>Status: {status}</p>

      {role === "recipient" && (
        <div>
          <h3>Your Screen (Recipient)</h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ maxWidth: "100%", border: "1px solid gray" }}
          ></video>
        </div>
      )}

      {role === "sender" && (
        <div>
          <h3>Recipient's Screen (Sender)</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ maxWidth: "100%", border: "1px solid gray" }}
          ></video>
        </div>
      )}

      {/* Add a button to end session if needed */}
      {/* <button onClick={handleEndSession}>End Session</button> */}
    </div>
  );
}

export default ScreenShareViewer;
