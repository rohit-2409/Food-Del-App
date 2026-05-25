import { useCallback, useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { seedFoodItems } from "../../assets/seedData";

// Canonical category order matching the frontend menu
const CATEGORY_ORDER = [
  "Salad", "Rolls", "Deserts", "Sandwich",
  "Cake", "Pure Veg", "Pasta", "Noodles"
];

// Returns items sorted by category order then by name
function sortAndGroup(items) {
  const sorted = [...items].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category);
    const bi = CATEGORY_ORDER.indexOf(b.category);
    const catDiff = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    if (catDiff !== 0) return catDiff;
    return a.name.localeCompare(b.name);
  });

  // Group into { category: [items] }
  const groups = {};
  sorted.forEach((item) => {
    const cat = item.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });
  return groups;
}

// Detect duplicate names — keep newest (_id is MongoDB ObjectId, lexicographically later = newer)
function findDuplicates(items) {
  const seen = {};
  const duplicateIds = [];
  // Sort by _id ascending so we keep the LAST one (newest)
  const sorted = [...items].sort((a, b) => {
    const idA = a._id || "";
    const idB = b._id || "";
    return idA.localeCompare(idB);
  });
  sorted.forEach((item) => {
    const key = item.name.trim().toLowerCase();
    if (seen[key]) {
      duplicateIds.push(seen[key]); // push the OLDER id
    }
    seen[key] = item._id;
  });
  return duplicateIds;
}

const List = ({ url }) => {
  const [list, setList]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [removing, setRemoving] = useState(null);
  const [purging, setPurging]   = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        setIsOffline(false);
        // Sync cache
        localStorage.setItem("admin_food_list", JSON.stringify(response.data.data));
      } else {
        toast.error("Failed to load food items");
      }
    } catch (err) {
      console.warn("Backend server connection failed. Falling back to persistent local storage database.", err);
      setIsOffline(true);
      
      // Load from localStorage cache or fallback to Seed Items
      let localData = localStorage.getItem("admin_food_list");
      if (localData) {
        setList(JSON.parse(localData));
      } else {
        // Seed default items if local storage is completely empty
        localStorage.setItem("admin_food_list", JSON.stringify(seedFoodItems));
        setList(seedFoodItems);
      }
      
      // Notify once using unique toastId so it doesn't spam on refresh
      toast.info("⚡ Server offline: Loaded persistent local database", {
        toastId: "offline-status-toast"
      });
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchList(); }, [fetchList]);

  // ── Remove single item ─────────────────────────────────────
  const removeFood = async (foodId) => {
    setRemoving(foodId);
    try {
      // Try backend first
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success("Item removed successfully");
        fetchList();
      } else {
        toast.error("Failed to remove item");
      }
    } catch (err) {
      console.warn("Removing from local storage database (server offline)", err);
      // Remove locally from state and localStorage
      let localData = localStorage.getItem("admin_food_list");
      if (localData) {
        const parsed = JSON.parse(localData);
        const updated = parsed.filter(item => item._id !== foodId);
        localStorage.setItem("admin_food_list", JSON.stringify(updated));
        setList(updated);
        toast.success("🗑️ Removed item from local database (Offline Mode)");
      } else {
        toast.error("Failed to remove item: local database empty");
      }
    } finally {
      setRemoving(null);
    }
  };

  // ── Purge all duplicates ───────────────────────────────────
  const purgeDuplicates = async () => {
    const dupIds = findDuplicates(list);
    if (dupIds.length === 0) {
      toast.info("✅ No duplicates found — list is clean!");
      return;
    }
    setPurging(true);
    try {
      if (isOffline) {
        let localData = localStorage.getItem("admin_food_list");
        if (localData) {
          const parsed = JSON.parse(localData);
          const updated = parsed.filter(item => !dupIds.includes(item._id));
          localStorage.setItem("admin_food_list", JSON.stringify(updated));
          setList(updated);
          toast.success(`🗑️ Offline: Removed ${dupIds.length} duplicate item(s)`);
        }
      } else {
        await Promise.all(
          dupIds.map((id) =>
            axios.post(`${url}/api/food/remove`, { id })
          )
        );
        toast.success(`🗑️ Removed ${dupIds.length} duplicate item(s)`);
        fetchList();
      }
    } catch {
      toast.error("Error purging duplicates");
    } finally {
      setPurging(false);
    }
  };

  // ── Derived data ───────────────────────────────────────────
  const groups     = sortAndGroup(list);
  const dupIds     = findDuplicates(list);
  const dupCount   = dupIds.length;
  const dupSet     = new Set(dupIds);

  let serial = 0; // global serial counter across categories

  return (
    <div className="list-page">

      {/* ── STATUS BANNER ───────────────────────────────────── */}
      <div className={`status-banner ${isOffline ? 'offline' : 'online'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {isOffline
            ? "⚡ Offline Mode: Operating on local database. Changes are saved locally and persist on refresh!"
            : "🟢 Online Mode: Synchronised with the live Node.js & MongoDB server."}
        </span>
      </div>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="list-header">
        <div>
          <p className="list-eyebrow">Menu Management</p>
          <h2>Food Items List</h2>
          <p>
            Items are grouped by category and sorted alphabetically.
            Use <strong>Remove</strong> to delete individual entries or
            purge all duplicates at once.
          </p>
        </div>

        <div className="list-header-right">
          {!loading && (
            <div className="list-badge">{list.length} Items</div>
          )}
          {dupCount > 0 && (
            <button
              className="purge-btn"
              onClick={purgeDuplicates}
              disabled={purging}
            >
              {purging ? "Purging…" : `🧹 Remove ${dupCount} Duplicate${dupCount > 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      </div>

      {/* ── TABLE HEADER ───────────────────────────────────── */}
      {!loading && list.length > 0 && (
        <div className="list-table title">
          <b>#</b>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
      )}

      {/* ── LOADING ────────────────────────────────────────── */}
      {loading ? (
        <div className="loading">
          <div className="loader"></div>
          <p>Loading food items…</p>
        </div>

      ) : list.length === 0 ? (

        /* ── EMPTY STATE ───────────────────────────────────── */
        <div className="empty-state">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7466/7466147.png"
            alt="No Food"
          />
          <h3>No Food Items Found</h3>
          <p>Add new food products from the Add page.</p>
        </div>

      ) : (

        /* ── GROUPED FOOD ITEMS ────────────────────────────── */
        <div className="food-list">
          {Object.entries(groups).map(([category, items]) => (
            <div key={category} className="category-group">

              {/* Category separator */}
              <div className="category-separator">
                <span className="category-label">{category}</span>
                <span className="category-count">{items.length} item{items.length > 1 ? "s" : ""}</span>
              </div>

              {items.map((item) => {
                serial += 1;
                const isDuplicate = dupSet.has(item._id);
                // Price shown in app: legacy price under 50 is multiplied by 10
                const displayPrice = item.price < 50 ? item.price * 10 : item.price;
                const isUrlImage = item.image && (item.image.startsWith("http") || item.image.startsWith("data:"));

                return (
                  <div
                    className={`list-table${isDuplicate ? " duplicate-row" : ""}`}
                    key={item._id}
                  >
                    {/* Serial # */}
                    <span className="serial-no">{serial}</span>

                    {/* Image */}
                    <img
                      src={isUrlImage ? item.image : `${url}/images/${item.image}`}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=60";
                      }}
                    />

                    {/* Name */}
                    <p>
                      {item.name}
                      {isDuplicate && (
                        <span className="dup-badge">DUPLICATE</span>
                      )}
                    </p>

                    {/* Category */}
                    <span className="cat-chip">{item.category}</span>

                    {/* Price */}
                    <p className="price">₹{displayPrice}</p>

                    {/* Action */}
                    <button
                      onClick={() => removeFood(item._id)}
                      className={`delete-btn${isDuplicate ? " dup-delete" : ""}`}
                      disabled={removing === item._id}
                    >
                      {removing === item._id ? "…" : "Remove"}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default List;