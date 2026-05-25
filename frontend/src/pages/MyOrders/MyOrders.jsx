import { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

// Status pipeline — must match what the backend/admin sets
const STATUS_STEPS = [
  {
    key: "Food Processing",
    label: "Order Placed",
    icon: "🧾",
    desc: "Your order has been received and is being prepared.",
  },
  {
    key: "Out for Delivery",
    label: "Out for Delivery",
    icon: "🛵",
    desc: "Our delivery partner is on the way to your door!",
  },
  {
    key: "Delivered",
    label: "Delivered",
    icon: "✅",
    desc: "Your order has been delivered. Enjoy your meal!",
  },
];

function getStepIndex(status) {
  const idx = STATUS_STEPS.findIndex(
    (s) => s.key.toLowerCase() === (status || "").toLowerCase()
  );
  return idx === -1 ? 0 : idx;
}

// ── TrackingModal ──────────────────────────────────────────
function TrackingModal({ order, currency, onClose }) {
  if (!order) return null;

  const activeStep = getStepIndex(order.status);
  const placedDate = order.date
    ? new Date(order.date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

  return (
    <div className="track-overlay" onClick={onClose}>
      <div className="track-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="track-modal-header">
          <div>
            <p className="track-eyebrow">Order Tracking</p>
            <h2>Track Your Order</h2>
          </div>
          <button className="track-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Order meta */}
        <div className="track-meta">
          <div className="track-meta-item">
            <span className="track-meta-label">Order ID</span>
            <span className="track-meta-value">#{String(order._id).slice(-8).toUpperCase()}</span>
          </div>
          <div className="track-meta-item">
            <span className="track-meta-label">Total Amount</span>
            <span className="track-meta-value price">{currency}{order.amount}</span>
          </div>
          <div className="track-meta-item">
            <span className="track-meta-label">Items</span>
            <span className="track-meta-value">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
          </div>
          <div className="track-meta-item">
            <span className="track-meta-label">Placed On</span>
            <span className="track-meta-value">{placedDate}</span>
          </div>
        </div>

        {/* Progress stepper */}
        <div className="track-stepper">
          {STATUS_STEPS.map((step, idx) => {
            const isDone    = idx < activeStep;
            const isActive  = idx === activeStep;
            const isPending = idx > activeStep;

            return (
              <div key={step.key} className="track-step-row">
                {/* Connector line above (not for first) */}
                {idx > 0 && (
                  <div className={`track-line ${idx <= activeStep ? 'track-line--done' : ''}`} />
                )}

                <div className={`track-step ${isActive ? 'track-step--active' : ''} ${isDone ? 'track-step--done' : ''} ${isPending ? 'track-step--pending' : ''}`}>

                  {/* Circle */}
                  <div className="track-circle">
                    {isDone  && <span className="track-check">✓</span>}
                    {isActive && <span className="track-pulse" />}
                    {!isDone && !isActive && <span className="track-dot" />}
                  </div>

                  {/* Content */}
                  <div className="track-step-content">
                    <div className="track-step-icon">{step.icon}</div>
                    <div>
                      <p className="track-step-label">{step.label}</p>
                      {isActive && (
                        <p className="track-step-desc">{step.desc}</p>
                      )}
                    </div>
                    {isActive && (
                      <span className="track-status-badge">Current</span>
                    )}
                    {isDone && (
                      <span className="track-status-badge track-status-badge--done">Done</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Items summary */}
        <div className="track-items">
          <p className="track-items-title">Items in this order</p>
          <div className="track-items-list">
            {order.items.map((item, i) => (
              <div key={i} className="track-item-chip">
                🍽️ {item.name} <span>×{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery address */}
        {order.address && (
          <div className="track-address">
            <p className="track-items-title">📍 Delivery Address</p>
            <p>
              {order.address.firstName} {order.address.lastName},{" "}
              {order.address.street}, {order.address.city},{" "}
              {order.address.state} – {order.address.zipcode}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

// ── MyOrders ───────────────────────────────────────────────
const MyOrders = () => {

  const [data, setData]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [trackingOrder, setTracking]  = useState(null);

  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      // Sort newest first
      const sorted = (response.data.data || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setData(sorted);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleTrack = (order) => {
    setTracking(order);
  };

  const statusColor = (status) => {
    if (!status) return "#6b7280";
    const s = status.toLowerCase();
    if (s.includes("delivered"))    return "#10b981";
    if (s.includes("out for"))      return "#f59e0b";
    return "#6366f1";
  };

  return (
    <div className="my-orders">

      <div className="my-orders-header">
        <h2>My Orders</h2>
        {!loading && (
          <span className="orders-count">{data.length} order{data.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div className="container">

        {loading ? (
          <div className="orders-loading">
            <div className="orders-spinner" />
            <p>Loading your orders…</p>
          </div>
        ) : data.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">🛒</div>
            <h3>No Orders Yet</h3>
            <p>Your order history will appear here once you place an order.</p>
          </div>
        ) : (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">

              <img src={assets.parcel_icon} alt="parcel" />

              <p className="order-items-text">
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} ×${item.quantity}`
                    : `${item.name} ×${item.quantity}, `
                )}
              </p>

              <p className="order-amount">{currency}{order.amount}.00</p>

              <p className="order-item-count">
                Items: <strong>{order.items.length}</strong>
              </p>

              <p className="order-status-text">
                <span
                  className="status-dot"
                  style={{ color: statusColor(order.status) }}
                >●</span>
                <strong>{order.status}</strong>
              </p>

              <button
                className="track-btn"
                onClick={() => handleTrack(order)}
              >
                📍 Track Order
              </button>

            </div>
          ))
        )}
      </div>

      {/* ── Tracking Modal ── */}
      {trackingOrder && (
        <TrackingModal
          order={trackingOrder}
          currency={currency}
          onClose={() => setTracking(null)}
        />
      )}

    </div>
  );
};

export default MyOrders;
