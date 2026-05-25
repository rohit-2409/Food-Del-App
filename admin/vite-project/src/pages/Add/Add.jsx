import { useState, useEffect } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { seedFoodItems } from "../../assets/seedData";

const CATEGORIES = [
  "Salad", "Rolls", "Deserts", "Sandwich",
  "Cake", "Pure Veg", "Pasta", "Noodles",
];

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const Add = ({ url }) => {

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  // Check server status on mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${url}/`);
        setIsOffline(false);
      } catch {
        setIsOffline(true);
      }
    };
    checkServer();
  }, [url]);

  // ── Input handler ────────────────────────────────────────
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Submit ────────────────────────────────────────────────
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      return toast.error("Please upload a food image");
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name",        data.name);
      formData.append("description", data.description);
      formData.append("price",       Number(data.price));
      formData.append("category",    data.category);
      formData.append("image",       image);

      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        toast.success("✅ Food item added successfully!");
        setData({ name: "", description: "", price: "", category: "Salad" });
        setImage(null);
        setIsOffline(false);
      } else {
        toast.error(response.data.message || "Failed to add item");
      }
    } catch (error) {
      console.warn("Backend add failed. Falling back to persistent local storage database.", error);
      setIsOffline(true);
      try {
        const base64Image = await fileToBase64(image);
        const localItem = {
          _id: "local_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
          name: data.name,
          description: data.description,
          price: Number(data.price),
          category: data.category,
          image: base64Image
        };

        // Load current local list
        let localData = localStorage.getItem("admin_food_list");
        let currentList = [];
        if (localData) {
          currentList = JSON.parse(localData);
        } else {
          // If empty, fetch default seed data first
          currentList = [...seedFoodItems];
        }
        currentList.push(localItem);
        localStorage.setItem("admin_food_list", JSON.stringify(currentList));

        toast.success("✅ Food item added to local database (Offline Mode)!");
        setData({ name: "", description: "", price: "", category: "Salad" });
        setImage(null);
      } catch (fileErr) {
        console.error("Local save failed", fileErr);
        toast.error("Failed to add item locally.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add">
      {/* ── STATUS BANNER ───────────────────────────────────── */}
      <div className={`status-banner ${isOffline ? 'offline' : 'online'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {isOffline
            ? "⚡ Offline Mode: Adding items to local database. Changes are saved locally and persist on refresh!"
            : "🟢 Online Mode: Synchronised with the live Node.js & MongoDB server."}
        </span>
      </div>

      <div className="add-container">

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className="add-header">
          <span className="mini-title">🍽️ Food Admin Panel</span>
          <h1>Add New Food Item</h1>
          <p>
            Create attractive menu items with high-quality images, fair
            pricing and detailed descriptions to delight your customers.
          </p>
        </div>

        {/* ── FORM ───────────────────────────────────────── */}
        <form onSubmit={onSubmitHandler} className="add-form">

          {/* ── LEFT — IMAGE UPLOAD ──────────────────────── */}
          <div className="left-panel">
            <div className="card-title">
              <h2>📸 Food Image</h2>
              <p>Upload a crisp, appetising photo — it's the first thing customers see.</p>
            </div>

            <label htmlFor="image" className="upload-area">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="upload preview"
                className="preview-image"
              />

              {!image && (
                <div className="upload-text">
                  <h3>Click to Upload</h3>
                  <p>PNG · JPG · JPEG · WEBP</p>
                  <span className="upload-icon-pill">⬆ Choose File</span>
                </div>
              )}

              {image && (
                <div className="upload-text">
                  <h3>Image Selected ✓</h3>
                  <p>{image.name}</p>
                  <span className="upload-icon-pill">🔄 Change Photo</span>
                </div>
              )}
            </label>

            <input
              type="file"
              id="image"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {/* Tips */}
            <div className="tips-box">
              <h4>📌 Image Tips</h4>
              <ul>
                <li>Use a bright, well-lit photo with a clean background.</li>
                <li>Square images (1:1) look best on the menu cards.</li>
                <li>Minimum recommended size: 400 × 400 px.</li>
              </ul>
            </div>
          </div>

          {/* ── RIGHT — DETAILS ──────────────────────────── */}
          <div className="right-panel">
            <div className="card-title">
              <h2>📋 Food Details</h2>
              <p>Fill in accurate information for a great customer experience.</p>
            </div>

            {/* Product Name */}
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Grilled Chicken Sandwich"
                value={data.name}
                onChange={onChangeHandler}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="5"
                name="description"
                placeholder="Describe the dish — ingredients, flavours, highlights…"
                value={data.description}
                onChange={onChangeHandler}
                required
              />
            </div>

            {/* Category + Price */}
            <div className="double-input">

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={data.category}
                  onChange={onChangeHandler}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <div className="price-input-wrap">
                  <span className="price-prefix">₹</span>
                  <input
                    type="number"
                    name="price"
                    placeholder="150"
                    value={data.price}
                    onChange={onChangeHandler}
                    required
                    min="50"
                    max="2000"
                  />
                </div>
                <span className="price-hint">Min ₹50 · Recommended ₹130–₹350</span>
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? "⏳ Adding Item…" : "✅ Add Food Item"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;