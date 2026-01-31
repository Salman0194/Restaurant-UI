import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./MenuManager.css";

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("/menu");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load menu", err);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);

      // ✅ append image only when selected
      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        // UPDATE (optional image)
        await axios.put(`/menu/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // CREATE (image required)
        await axios.post("/menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchMenu();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price);
    setImage(null); // image optional on edit
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      await axios.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="menu-manager">
      <h2>Menu Manager</h2>

      {/* Add / Edit Form */}
      <form className="menu-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {/* ✅ Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required={!editingId}
        />

        <button type="submit" disabled={loading}>
          {editingId ? "Update Item" : "Add Item"}
        </button>

        {editingId && (
          <button type="button" className="cancel" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {/* Menu List */}
      <table className="menu-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="4">No menu items</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.imageUrl && (
                    <img
                      src={`https://localhost:7191${item.imageUrl}`}
                      alt={item.name}
                      style={{ width: 60, height: 40, objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MenuManager;
