import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/order/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-header">
            <strong>Order #{order.id}</strong>
            <span className={`order-status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          <p>Total: ₹{order.totalAmount}</p>
          <p>Ordered On: {formatDate(order.orderDate)}</p>

          <table className="orders-table">
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
                  <td>{item.menuItem?.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
