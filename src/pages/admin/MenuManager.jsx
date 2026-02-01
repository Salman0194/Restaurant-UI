import { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import "./MenuManager.css";

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ REF for file input
  const fileInputRef = useRef(null);

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

  // ✅ Proper reset (including file input)
  const resetForm = () => {
    setName("");
    setPrice("");
    setImage(null);
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);

      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await axios.put(`/menu/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
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
    setImage(null);

    // clear previous file visually when editing
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

        {/* ✅ File input with ref */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
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

      {/* Menu Table */}
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
                      style={{
                        width: 60,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <button
                    className="edit"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>

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
