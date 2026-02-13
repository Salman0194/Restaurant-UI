import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const response = await axios.get("/orders/my");
      // Ensures the data is an array before setting state
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch my orders", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmCancel) return;

    try {
      setCancellingId(orderId);
      // Hits the PUT endpoint defined in your routes
      await axios.put(`/orders/${orderId}/cancel`);

      // 🔄 Instant UI update: Changes status to CANCELLED locally
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELLED" } : order,
        ),
      );
    } catch (error) {
      console.error("Cancel order failed", error);
      alert("Unable to cancel order. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="orders-page">
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        orders.map((order) => {
          /** * 🛠️ THE FIX: DATA NORMALIZATION
           * Handles Sequelize 'underscored: true' and PascalCase issues.
           * Using .toUpperCase() ensures the 'PENDING' check is case-insensitive.
           */

          console.log("Full Order Object:", order);

          const rawStatus = order.status || order.Status || "";
          const normalizedStatus = String(rawStatus).trim().toUpperCase();

          return (
            <div className="order-card" key={order.id}>
              {/* HEADER */}
              <div className="order-header">
                <strong>Order #{order.id}</strong>
                <span
                  className={`order-status ${normalizedStatus.toLowerCase()}`}
                >
                  {normalizedStatus}
                </span>
              </div>

              {/* META INFO */}
              <div className="order-details">
                <p>
                  <strong>Total:</strong> ₹
                  {Number(order.total_amount).toLocaleString("en-IN")}
                </p>
                <p>
                  <strong>Ordered On:</strong>{" "}
                  {/* Supports created_at from your snake_case database record */}
                  {formatDate(order.created_at || order.createdAt)}
                </p>
              </div>

              {/* ITEMS TABLE */}
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.menuItem?.name || "Unknown Item"}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 🎯 ACTION AREA: 
                  The cancel button only renders if normalizedStatus is exactly "PENDING". 
              */}
              {normalizedStatus === "PENDING" && (
                <div
                  className="order-actions"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                    padding: "10px",
                    borderTop: "1px solid #eee",
                    minHeight: "50px",
                  }}
                >
                  <button
                    className="cancel-btn"
                    onClick={() => cancelOrder(order.id)}
                    disabled={cancellingId === order.id}
                    style={{
                      opacity: 1,
                      visibility: "visible",
                      cursor: "pointer",
                    }}
                  >
                    {cancellingId === order.id
                      ? "Processing..."
                      : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;
