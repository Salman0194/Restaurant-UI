import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const loggedInUser = response.data;
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Invalid email or password",
      };
    }
  };

   // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ROLE CHECKS
  const isAdmin = () => user?.role === "Admin";
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin,
        isAuthenticated,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);