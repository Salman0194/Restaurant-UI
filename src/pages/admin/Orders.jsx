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

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/order");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: backend expects status as query param
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/order/${orderId}/status?status=${newStatus}`);
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
            {/* ✅ HEADER: status dropdown moved here */}
            <div className="order-header">
              <h3>Order #{order.id}</h3>

              <select
                value={order.status}
                disabled={order.status === "Completed"} // 🔒 LOCK WHEN COMPLETED
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <p>
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(order.orderDate)}
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
                {order.items.map((item, index) => (
                  <tr key={index}>
                    {/* ✅ FIXED: correct item name */}
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
