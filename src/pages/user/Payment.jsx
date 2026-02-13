import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../../api/axios";
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // 🛑 Empty cart check
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const items = cart.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
    }));

    try {
      setLoading(true);

      // ✅ CORRECT ENDPOINT (plural)
      await axios.post("/orders", { items });

      // ✅ Clear cart
      localStorage.removeItem("cart");

      // ✅ Redirect to My Orders
      navigate("/my-orders");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        alert("Failed to place order");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h2 className="payment-title">Payment</h2>
      <p className="payment-subtitle">
        Please review your order and proceed with payment.
      </p>

      <div className="payment-card">
        <h3>Payment Method</h3>

        <label className="radio-option">
          <input type="radio" name="payment" defaultChecked />
          Cash on Delivery
        </label>

        <label className="radio-option">
          <input type="radio" name="payment" disabled />
          Online Payment (Coming Soon)
        </label>

        <button
          className="place-order-btn"
          onClick={placeOrder}
          disabled={loading}
        >
          {loading ? "PLACING ORDER..." : "PLACE ORDER"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
