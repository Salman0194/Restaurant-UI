import { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import Category from "../admin/Category";
import "./MenuManager.css";

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  /* ================= FETCH MENU ================= */
  const fetchMenu = async () => {
    try {
      const res = await axios.get("/menu");
      setItems(
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );
    } catch (err) {
      console.error("Failed to load menu", err);
      setItems([]);
    }
  };

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategoryId("");
    setImage(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= ADD / UPDATE (FIXED FLOW) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let menuId = editingId;

      // 1️⃣ CREATE or UPDATE MENU (NO IMAGE)
      if (editingId) {
        await axios.put(`/menu/${editingId}`, {
          name,
          price,
          category_id: categoryId,
        });
      } else {
        const res = await axios.post("/menu", {
          name,
          price,
          category_id: categoryId,
        });
        menuId = res.data.id; // ✅ menuId now exists
      }

      // 2️⃣ UPLOAD IMAGE USING menuId
      if (image && menuId) {
        const imageData = new FormData();
        imageData.append("image", image);

        await axios.post(`/menu/${menuId}/image`, imageData, {
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

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price);
    setCategoryId(item.category_id);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= DELETE ================= */
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

      {/* ================= FORM ================= */}
      <form className="menu-form" onSubmit={handleSubmit}>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files[0])}
          required={!editingId}
        />

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {editingId ? "Update Item" : "Add Item"}
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => setShowCategoryModal(true)}
          >
            Add Category
          </button>

          {editingId && (
            <button type="button" className="cancel" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= TABLE ================= */}
      <table className="menu-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Category</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="5">No menu items</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={`http://localhost:3000/uploads/menu/${item.id}.jpg`}
                    alt={item.name}
                    onError={(e) => (e.target.src = "/no-image.png")}
                    style={{
                      width: 60,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                </td>

                <td>{item.category?.name || "-"}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>

                <td>
                  <button className="edit" onClick={() => handleEdit(item)}>
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

      {/* ================= CATEGORY MODAL ================= */}
      {showCategoryModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Category</h3>
              <button
                className="close"
                onClick={() => {
                  setShowCategoryModal(false);
                  fetchCategories();
                }}
              >
                ✕
              </button>
            </div>

            <Category
              onSaved={() => {
                fetchCategories();
                setShowCategoryModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
