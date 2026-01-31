import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalOrders: 0,
    menuItems: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch menu & orders in parallel
        const [menuRes, orderRes] = await Promise.all([
          axios.get("/Menu"),
          axios.get("/Order"),
        ]);

        const orders = orderRes.data;
        const menu = menuRes.data;

        const revenue = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        setStats({
          totalOrders: orders.length,
          menuItems: menu.length,
          revenue,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-subtitle">
        Welcome back, {user?.role}
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <span>{stats.totalOrders}</span>
        </div>

        <div className="stat-card">
          <h3>Menu Items</h3>
          <span>{stats.menuItems}</span>
        </div>

        <div className="stat-card">
          <h3>Revenue</h3>
          <span>₹{stats.revenue}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
