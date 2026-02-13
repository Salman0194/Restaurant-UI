import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // required for refresh token cookie
});

// ================= REQUEST INTERCEPTOR =================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 🔄 Call refresh token endpoint
        const response = await axiosInstance.post("/auth/refresh-token");

        const newAccessToken = response.data.accessToken;

        // ✅ Update token in localStorage
        localStorage.setItem("token", newAccessToken);

        // ✅ Update user object token
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          storedUser.token = newAccessToken;
          localStorage.setItem("user", JSON.stringify(storedUser));
        }

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.warn("Refresh failed. Logging out.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
