import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalOrders: 0,
    menuItems: 0,
    revenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch menu & orders in parallel
        const [menuRes, orderRes] = await Promise.all([
          axios.get("/menu"),
          axios.get("/orders")
        ]);

        // 🔒 Safely handle API response shapes
        const orders = Array.isArray(orderRes.data)
          ? orderRes.data
          : orderRes.data?.data || [];

        const menu = Array.isArray(menuRes.data)
          ? menuRes.data
          : menuRes.data?.data || [];

        // ✅ Correct DB field name
        const revenue = orders.reduce(
          (sum, order) => sum + Number(order.total_amount || 0),
          0
        );

        setStats({
          totalOrders: orders.length,
          menuItems: menu.length,
          revenue
        });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
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
        Welcome back, {user?.role || "Admin"}
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
          <span>₹{stats.revenue.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
