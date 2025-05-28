import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Replace with your Django backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ4NDI2MTYzLCJpYXQiOjE3NDg0MjI1NjMsImp0aSI6IjJkNGNmMDUzNmI4ZjQ4ZDU4NzNmOWViNTVmZDhhYzkxIiwidXNlcl9pZCI6Mn0.7spWzoDzdRueWAP1ccvuuQyb3_MAPNPLNZfl4SczYYSS9NhOCGzYYVZLGqvv7qioCOiPv9TvSrQsZS8Rdy86Zg",
  },
});

// Optional: Add an interceptor to include JWT token if you're using authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Or wherever you store your token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  // Example login (you'd have a Django endpoint for this)
  login: async (email, password) => {
    const response = await api.post("/auth/token/", { email, password });
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    return response.data;
  },
  // Example logout
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
  // Function to get current user details
  getCurrentUser: async () => {
    const response = await api.get("/users/me/");
    return response.data;
  },
};

export const userService = {
  updateUserSettings: async (settings) => {
    const response = await api.patch("/users/me/", settings);
    return response.data;
  },
};

export const screenShareService = {
  startScreenShare: async (accessCode) => {
    const response = await api.post("/screen-share/start/", {
      access_code: accessCode,
    });
    return response.data;
  },
  fetchSenderSession: async (recipientEmail) => {
    const response = await api.post("/api/screen-share/start/");
    return response.data;
  },
};

export default api;
