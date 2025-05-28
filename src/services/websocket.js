// services/websocket.js
export const setupWebSocket = (url) => {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("WebSocket connected.");
  };

  ws.onmessage = (event) => {
    // This will be handled by the component using this service
    console.log("WS message received:", event.data);
  };

  ws.onclose = (event) => {
    console.log("WebSocket disconnected:", event);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return ws;
};
