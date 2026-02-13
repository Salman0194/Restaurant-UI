import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= RESTORE USER ON REFRESH =================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, role } = response.data;

      // Create user object manually (backend no longer returns full user)
      const userData = {
        email,
        role,
        token: accessToken,
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", accessToken);

      setUser(userData);

      // 🔥 Merge pendingCart into cart
      const pendingCart =
        JSON.parse(localStorage.getItem("pendingCart")) || [];

      if (pendingCart.length > 0) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        pendingCart.forEach((item) => {
          const index = cart.findIndex(
            (cartItem) => cartItem.id === item.id
          );

          if (index !== -1) {
            cart[index].quantity += item.quantity;
          } else {
            cart.push(item);
          }
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.removeItem("pendingCart");
      }

      return { success: true, role };

    } catch (error) {
      const status = error.response?.status;

      return {
        success: false,
        status,
        message:
          error.response?.data?.message || "Invalid email or password",
      };
    }
  };

  // ================= REFRESH TOKEN =================
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post("/auth/refresh-token");

      const newAccessToken = response.data.accessToken;

      const updatedUser = {
        ...user,
        token: newAccessToken,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", newAccessToken);

      setUser(updatedUser);

      return newAccessToken;
    } catch (error) {
      logout();
      return null;
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ================= ROLE CHECKS =================
  const isAdmin = () => user?.role === "admin";
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshAccessToken,
        isAdmin,
        isAuthenticated,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
