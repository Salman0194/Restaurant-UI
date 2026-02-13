// src/pages/user/Cart.jsx
import { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import noImage from "../../assets/no-image.png";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = cartItems.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="cart-page">
      <div className="cart-table">
        <div className="cart-header">
          <span>Items</span>
          <span>Title</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
          <span>Remove</span>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div className="cart-row" key={item.id}>
              {/* ✅ FIXED IMAGE SOURCE */}
              <img
                src={`http://localhost:3000/uploads/menu/${item.id}.jpg`}
                alt={item.name}
                onError={(e) => (e.target.src = noImage)}
              />

              <span>{item.name}</span>
              <span>₹{item.price}</span>
              <span>{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>

              <button onClick={() => removeItem(item.id)}>✖</button>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <div className="summary-left">
          <h3>Cart Total</h3>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-line">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="summary-line total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/payment")}
            disabled={cartItems.length === 0}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="summary-right">
          <p>If you have promo code, enter here</p>
          <div className="promo-box">
            <input type="text" placeholder="promo code" />
            <button disabled>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
