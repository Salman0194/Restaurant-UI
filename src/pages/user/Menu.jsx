// src/pages/user/Menu.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import noImage from "../../assets/no-image.png";

const API_BASE_URL = "https://localhost:7191";

const Menu = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get("/menu");
        setMenuItems(response.data);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = existingCart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (index !== -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
  };

  if (loading) return <p>Loading menu...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome {user?.role === "User" ? "Customer" : "Admin"} 👋</h2>
      <h3>Menu</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <img
              src={`${API_BASE_URL}${item.imageUrl}`}
              alt={item.name}
              style={{
                width: "100%",
                height: "140px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
              onError={(e) => (e.target.src = noImage)}
            />

            <h4>{item.name}</h4>
            <p>₹{item.price}</p>

            <button
              onClick={() => addToCart(item)}
              style={{
                marginTop: "10px",
                padding: "8px 14px",
                backgroundColor: "#ff5722",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
