# 🍅 Tomato - Full-Stack Food Ordering & Delivery Platform

Tomato is a modern, fully functional full-stack food ordering website. It offers a seamless, highly interactive web interface for food lovers to browse menus, manage their carts in real time, and process simulated secure online checkout systems, backed by an autonomous administrative dashboard framework.

### 📱 Preview & Responsiveness
The interface is engineered with a mobile-first philosophy to ensure fluid screen transitions across all devices.

> 💡 **Quick Test Drive Guide:** > 1. Open the Customer Storefront, select a food category, and add items to your cart.
> 2. Proceed to Checkout and fill out your shipping layout.
> 3. Select **COD (Cash on Delivery)** to see instant order completion, or choose **Stripe** to view the live payment gateway routing layer.
> 4. Check out your order status instantly inside the **My Orders** profile route!

---

## 🚀 Key Features

### 💻 Frontend (Customer Facing)
* **Dynamic Menu Explorer:** Sift through structured food classifications with state-driven visual active filtering toggles.
* **Real-Time Persistent Cart Context:** Synchronized cart value processing that instantly recalculates subtotal, delivery metrics, and global price indices.
* **Split-Gate Payment Methods:** Supports standard **Stripe (Credit/Debit)** checkout redirects alongside fully functional **Cash on Delivery (COD)** order processing.
* **Instant Order State Sync:** Visual payment verification loading frameworks that interface safely with server verification API endpoints.

### 🛡️ Admin Dashboard (Management Portal)
* **Structured Database Aggregation:** Comprehensive dashboard UI designed to add new dishes, upload assets, and define dynamic category metadata.
* **Live Order Tracking Panel:** Real-time state management utilities for incoming orders to update fulfillment cycles (e.g., *Food Processing* ➔ *Out for Delivery* ➔ *Delivered*).

---

## 🛠️ Tech Stack Architecture

| Layer | Technologies Utilized |
| :--- | :--- |
| **Frontend UI** | React.js, React Router DOM, React Toastify, Axios, Vanilla CSS3 |
| **State Management** | React Context API (`StoreContext`) |
| **Tooling & Bundlers** | Vite, Node.js (v18+ recommended) |

---

## 📁 Repository Directory Structure

```text
Tomato-App/
├── backend/                  # Node.js Express server & MongoDB configurations
├── admin/                    # React administration panel interface
└── frontend/                 # Client consumer storefront architecture
    ├── public/               # Static system SVGs & branding vectors
    └── src/
        ├── assets/           # UI media files, action markers, & icons
        ├── components/       # Reusable components (Header, Navbar, FoodItem)
        ├── Context/          # StoreContextProvider core state architecture
        ├── pages/            # Structural View Pages (Home, Cart, Verify)
        ├── App.jsx           # Global Router mapping & shell constraints
        └── main.jsx          # DOM entry wrapper mapping environment rules
