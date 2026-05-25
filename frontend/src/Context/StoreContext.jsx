import { createContext, useEffect, useState } from "react";
import { menu_list, food_list as food_list_static } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000";
    const [food_list, setFoodList] = useState(
        food_list_static.map(item => ({ ...item, price: item.price * 10 }))
    );
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cartItems");
            return savedCart ? JSON.parse(savedCart) : {};
        } catch {
            return {};
        }
    });
    const [token, setToken] = useState("");
    const [showLogin, setShowLogin] = useState(false);
    const currency = "₹";
    const deliveryCharge = 50;

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Add Item to Cart (State Management + Database Synchronization)
    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));

        if (token) {
            try {
                await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error adding item to database cart:", error);
            }
        }
    };

    // Remove Item from Cart
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[itemId] > 1) {
                updatedCart[itemId] -= 1;
            } else {
                delete updatedCart[itemId]; // 🎯 Cleans up the key if inventory drops to 0
            }
            return updatedCart;
        });

        if (token) {
            try {
                await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error removing item from database cart:", error);
            }
        }
    };

    // Calculate Total Cost of Cart Items Safely
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) { // 🎯 Safety Check: Ensures item data exists before multiplying
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    // Pull Current Menu Items from Backend
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success && response.data.data && response.data.data.length > 0) {
                // 🎯 Dynamically multiply the price of static/default items by 10 to keep local menu consistency,
                // but preserve the exact set price of any newly uploaded admin panel items!
                const staticNames = new Set(food_list_static.map(item => item.name));
                const updatedList = response.data.data.map(item => {
                    if (staticNames.has(item.name)) {
                        return { ...item, price: item.price * 10 };
                    }
                    return item;
                });
                setFoodList(updatedList);
                // Sync cache
                localStorage.setItem("admin_food_list", JSON.stringify(response.data.data));
            }
        } catch (error) {
            console.warn("Backend server connection failed. Loading from persistent local storage database.", error);
            const cached = localStorage.getItem("admin_food_list");
            if (cached) {
                const parsed = JSON.parse(cached);
                const updatedList = parsed.map(item => {
                    // Check if it's a legacy price under 50
                    if (item.price < 50) {
                        return { ...item, price: item.price * 10 };
                    }
                    return item;
                });
                setFoodList(updatedList);
            } else {
                // Fallback to static assets list
                const defaultList = food_list_static.map(item => ({ ...item, price: item.price * 10 }));
                setFoodList(defaultList);
                localStorage.setItem("admin_food_list", JSON.stringify(food_list_static));
            }
        }
    };

    // Load Saved Cart Items from Database Profile
    const loadCartData = async (userToken) => {
        try {
            // 🎯 FIXED: Correct structure wrapping for token verification header configuration
            const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token: userToken } });
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error("Error downloading database cart contents:", error);
        }
    };

    // Handle App Reload and Authorization States
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken); // 🎯 FIXED: Passing raw string token parameter value
            }
        }
        loadData();
    }, []);

    const [promoCode, setPromoCode] = useState("");

    const getDiscountAmount = () => {
        const subtotal = getTotalCartAmount();
        if (promoCode.trim().toLowerCase() === "rohit02" && subtotal > 200) {
            return Math.round(subtotal * 0.2); // 20% discount, rounded
        }
        return 0;
    };

    const getDiscountedTotal = () => {
        const subtotal = getTotalCartAmount();
        if (subtotal === 0) return 0;
        return subtotal - getDiscountAmount() + deliveryCharge;
    };

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        showLogin,
        setShowLogin,
        promoCode,
        setPromoCode,
        getDiscountAmount,
        getDiscountedTotal
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;