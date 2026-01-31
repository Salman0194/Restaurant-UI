// src/components/Header.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/logo.png";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Left: Logo */}
        <div className="brand" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" />
          <span>Foodie</span>
        </div>

        {/* Center: Navigation */}
        <nav className="nav">
          {/* Public */}
          <NavLink to="/" className="nav-item">
            Home
          </NavLink>

          <NavLink to="/aboutus" className="nav-item">
            About Us
          </NavLink>

          {/* User */}
          {user?.role === "User" && (
            <>
              <NavLink to="/menu" className="nav-item">
                Menu
              </NavLink>

              <NavLink to="/my-orders" className="nav-item">
                My Orders
              </NavLink>
              <NavLink to="/cart" className="nav-item">
                Cart
              </NavLink>
            </>
          )}

          {/* Admin */}
          {user?.role === "Admin" && (
            <>
              <NavLink to="/dashboard" className="nav-item">
                Dashboard
              </NavLink>

              <NavLink to="/manage-menu" className="nav-item">
                Menu Manager
              </NavLink>

              <NavLink to="/admin-orders" className="nav-item">
                Orders
              </NavLink>
            </>
          )}
        </nav>

        {/* Right: Auth Action */}
        {user ? (
          <button className="logout-pill" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="login-pill" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
