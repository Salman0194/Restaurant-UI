import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();

  const placeOrder = async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const items = cart.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity
    }));

    try {
      await axios.post(
        "/order",
        { items },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      localStorage.removeItem("cart");
      navigate("/admin/orders");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
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
          <input type="radio" name="payment" />
          Online Payment
        </label>

        <button className="place-order-btn" onClick={placeOrder}>
          PLACE ORDER
        </button>
      </div>
    </div>
  );
};

export default Payment;
