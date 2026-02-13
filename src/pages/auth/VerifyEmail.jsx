import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../api/axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Get email from location OR localStorage (refresh safe)
  const [email, setEmail] = useState(
    location.state?.email || localStorage.getItem("verifyEmail") || ""
  );

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Save email in localStorage so refresh won’t break
  useEffect(() => {
    if (email) {
      localStorage.setItem("verifyEmail", email);
    }
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post("/auth/verify-email", {
        email,
        otp
      });

      if (response.data.success) {
        setSuccess("Email verified successfully!");
        localStorage.removeItem("verifyEmail");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }

    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      await axios.post("/auth/resend-otp", { email });
      setSuccess("OTP resent successfully. Please check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }

    setResendLoading(false);
  };

  if (!email) {
    return (
      <div className="login-container">
        <h2>Invalid Access</h2>
        <p>Please login again.</p>
        <button onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>Verify Email</h2>

      <p>Email: <strong>{email}</strong></p>

      {error && <p className="error">{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div style={{ marginTop: "15px" }}>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendLoading}
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
