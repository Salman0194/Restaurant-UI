import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Foodie's Hub 🍽️</h1>
          <p>Delicious food delivered fresh to your door</p>

          <div className="hero-buttons">
            <Link to="/menu" className="btn primary">
              View Menu
            </Link>
            <Link to="/my-orders" className="btn secondary">
              My Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🍕 Fresh Food</h3>
            <p>Prepared daily with high-quality ingredients.</p>
          </div>

          <div className="feature-card">
            <h3>🚚 Fast Delivery</h3>
            <p>Hot and fresh delivery at your doorstep.</p>
          </div>

          <div className="feature-card">
            <h3>⭐ Top Rated</h3>
            <p>Loved by thousands of happy customers.</p>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;
