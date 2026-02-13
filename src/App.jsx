import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Header from "./components/Header";

// Public pages
import Home from "./pages/home/Home";
import AboutUs from "./pages/home/AboutUs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";

// User pages
import Menu from "./pages/user/Menu";
import Cart from "./pages/user/Cart";
import MyOrders from "./pages/user/MyOrders";
import Payment from "./pages/user/Payment";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import MenuManager from "./pages/admin/MenuManager";
import Orders from "./pages/admin/Orders";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />

        <Routes>
          {/* ---------- PUBLIC ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/menu" element={<Menu />} />

          {/* ---------- USER ---------- */}
          
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* ---------- ADMIN ---------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-menu"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <MenuManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-orders"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* ---------- FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
