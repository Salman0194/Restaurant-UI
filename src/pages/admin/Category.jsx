import { useState } from "react";
import axios from "../../api/axios";
import "./Category.css";

const Category = ({ onSaved }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/categories", { name: name.trim() });
      setName("");
      onSaved && onSaved();
    } catch (err) {
      setError(
        err.response?.status === 409
          ? "Category already exists"
          : "Failed to save category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />

      {error && <div className="category-error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Category"}
      </button>
    </form>
  );
};

export default Category;
