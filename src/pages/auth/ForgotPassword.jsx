import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ===================== SEND OTP ===================== */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/auth/forgot-password", { email });

      setSuccess(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== RESET PASSWORD ===================== */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim() || !newPassword.trim()) {
      setError("All fields are required");
      return;
    }

    // ✅ Length validation
    if (newPassword.length < 8 || newPassword.length > 15) {
      setError("Password must be between 8 and 15 characters");
      return;
    }

    // ✅ Strong password validation
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      setError(
        "Password must include 1 uppercase letter, 1 number and 1 special character"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/reset-password", {
        email,
        otp,
        newPassword
      });

      setSuccess(res.data.message || "Password reset successful");

      setOtp("");
      setNewPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <div>
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <small style={{ display: "block", marginTop: "5px", color: "#555" }}>
              Password must:
              <br />• Be 8–15 characters
              <br />• Include 1 uppercase letter
              <br />• Include 1 number
              <br />• Include 1 special character
            </small>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        <span
          style={{ color: "#1d2671", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </span>
      </p>
    </div>
  );
};

export default ForgotPassword;
