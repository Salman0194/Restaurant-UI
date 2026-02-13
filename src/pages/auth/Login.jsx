import { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import axios from "../../api/axios";
import "./Login.css";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/menu";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/dashboard" : from}
        replace
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(
        result.role === "admin" ? "/dashboard" : from,
        { replace: true }
      );
    } else {
      // Trigger OTP resend only if email not verified
      if (
        result.status === 403 &&
        result.message?.toLowerCase().includes("verify")
      ) {
        try {
          await axios.post("/auth/resend-otp", { email });
        } catch (err) {
          console.error("Auto OTP generation failed:", err);
        }

        navigate("/verify-email", {
          state: { email }
        });
      } else {
        setError(result.message || "Login failed");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* This wrapper allows us to constrain the width of the form elements */}
        <div className="login-content">
          <h2>Login</h2>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="forgot-password">
            <span onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </span>
          </div>

          <div className="register-link">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;