// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7191/api", // ✅ MUST include /api
  headers: {
    "Content-Type": "application/json",
  },
  // ❌ REMOVE withCredentials
});

// Attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")); // 👈 match AuthContext
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response; // backend down
    const isUnauthorized = error.response?.status === 401;

    if (isNetworkError || isUnauthorized) {
      console.warn("API unreachable or unauthorized. Logging out.");

      // clear auth
      localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
