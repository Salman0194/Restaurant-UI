import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import noImage from "../../assets/no-image.png";

const Menu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchMenu();
  }, []);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  // Fetch Menu
  const fetchMenu = async () => {
    try {
      const response = await axios.get("/menu");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setMenuItems(data);

      const initialQty = {};
      data.forEach((item) => {
        initialQty[item.id] = 1;
      });

      setQuantities(initialQty);
    } catch (error) {
      console.error("Failed to load menu", error);
    } finally {
      setLoading(false);
    }
  };

  // Quantity Controls
  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  // 🔥 Add to Cart (Correct Flow)
  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;

    // 🔐 If NOT logged in → Save in pendingCart
    if (!user) {
      const pendingCart =
        JSON.parse(localStorage.getItem("pendingCart")) || [];

      const existingIndex = pendingCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingIndex !== -1) {
        pendingCart[existingIndex].quantity += quantity;
      } else {
        pendingCart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity,
        });
      }

      localStorage.setItem("pendingCart", JSON.stringify(pendingCart));

      navigate("/login");
      return;
    }

    // ✅ If logged in → Add to real cart
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex((cartItem) => cartItem.id === item.id);

    if (index !== -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Item added to cart 🛒");
  };

  // Filter Menu by Category
  const filteredMenu =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter(
          (item) => Number(item.category_id) === Number(selectedCategory)
        );

  if (loading) return <p style={{ padding: 20 }}>Loading menu...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        Welcome{" "}
        {user
          ? user.role === "Admin"
            ? "Admin"
            : "Customer"
          : "Guest"}{" "}
        👋
      </h2>

      <h3>Menu</h3>

      {/* Category Filter */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setSelectedCategory("all")}
          style={selectedCategory === "all" ? activeCatBtn : catBtn}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={selectedCategory === cat.id ? activeCatBtn : catBtn}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredMenu.length === 0 ? (
          <p>No items in this category</p>
        ) : (
          filteredMenu.map((item) => (
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
                src={`http://localhost:3000/uploads/menu/${item.id}.jpg`}
                alt={item.name}
                onError={(e) => (e.target.src = noImage)}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />

              <h4>{item.name}</h4>
              <p>₹{item.price}</p>

              {/* Quantity Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                <button
                  onClick={() => decreaseQty(item.id)}
                  style={qtyBtnStyle}
                >
                  −
                </button>

                <span style={{ fontWeight: "600" }}>
                  {quantities[item.id] || 1}
                </span>

                <button
                  onClick={() => increaseQty(item.id)}
                  style={qtyBtnStyle}
                >
                  +
                </button>
              </div>

              <button onClick={() => addToCart(item)} style={addBtnStyle}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styles
const qtyBtnStyle = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  border: "none",
  backgroundColor: "#ff5722",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer",
};

const addBtnStyle = {
  padding: "8px 14px",
  backgroundColor: "#ff5722",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const catBtn = {
  padding: "6px 14px",
  borderRadius: "20px",
  border: "1px solid #ccc",
  background: "#f5f5f5",
  cursor: "pointer",
};

const activeCatBtn = {
  ...catBtn,
  background: "#ff5722",
  color: "#fff",
  border: "none",
};

export default Menu;
