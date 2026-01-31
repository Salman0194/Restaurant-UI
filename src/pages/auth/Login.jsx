// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./Login.css";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ If already logged in, redirect based on role
  if (user) {
    return (
      <Navigate
        to={user.role === "Admin" ? "/dashboard" : "/menu"}
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
      // ✅ Redirect based on role
      if (result.role === "Admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/menu", { replace: true });
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* 👇 REGISTER LINK */}
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "#1d2671", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
