import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Correct API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Correct status update
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}/status`, {
        status: newStatus
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) return <h2>Loading orders...</h2>;

  return (
    <div className="orders-container">
      <h1>📦 Orders Management</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            {/* HEADER */}
            <div className="order-header">
              <h3>Order #{order.id}</h3>

              <select
                value={order.status}
                disabled={order.status === "DELIVERED"}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <p>
              <strong>Total:</strong>{" "}
              ₹{Number(order.total_amount).toLocaleString("en-IN")}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {formatDate(order.created_at)}
            </p>

            <table className="order-items">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.menuItem?.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
