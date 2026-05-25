import { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const [promoInput, setPromoInput] = useState("");

  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    currency,
    deliveryCharge,
    url,
    token,
    setShowLogin,
    setCartItems,
    promoCode,
    setPromoCode,
    getDiscountAmount,
    getDiscountedTotal
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toLowerCase();
    if (code === "rohit02") {
      const subtotal = getTotalCartAmount();
      if (subtotal > 200) {
        setPromoCode("rohit02");
        toast.success("🎉 Promo code 'rohit02' applied! 20% discount has been deducted.");
      } else {
        toast.warning("⚠️ Promo code 'rohit02' is only valid for shopping above ₹200.");
      }
    } else if (code === "") {
      toast.info("Please enter a promo code.");
    } else {
      toast.error("❌ Invalid promo code.");
    }
  };

  const handlePromoClear = () => {
    setPromoCode("");
    setPromoInput("");
    toast.info("Promo code cleared.");
  };

  const selectAllItems = async () => {
    const updatedCart = {};
    food_list.forEach((item) => {
      updatedCart[item._id] = 1;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    toast.success("All 32 food items selected successfully!");

    if (token) {
      try {
        // Synchronize bulk cart adds with the backend MongoDB database
        for (const item of food_list) {
          await axios.post(`${url}/api/cart/add`, { itemId: item._id }, { headers: { token } });
        }
      } catch (error) {
        console.error("Bulk sync database cart error:", error);
      }
    }
  };


  const handleProceedToCheckout = () => {
    if (!token) {
      setShowLogin(true);
    } else {
      navigate('/order');
    }
  };

  const isCartEmpty = getTotalCartAmount() === 0;

  return (
    <div className='cart'>
      {/* ⚡ DEVELOPER QUICK BULK SELECTION PANEL */}
      {!isCartEmpty && (
        <div className="cart-sandbox-bar card-glow">
          <div className="sandbox-bar-text">
            <span>DEVELOPER TOOLKIT</span>
            <strong>Bulk Testing Mode:</strong> Skip home page selections and add all 32 menu items instantly!
          </div>
          <button onClick={selectAllItems} className="sandbox-bar-btn">
            🍲 Add All 32 Items
          </button>
        </div>
      )}

      {/* ================= CART ITEMS ================= */}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {isCartEmpty ? (
          <div className="empty-cart-state card-glow animate-fade-in">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>Skip manual menu navigation! Instantly populate your cart with all 32 premium items to test our lightning-fast checkout flow.</p>
            <div className="empty-cart-actions">
              <button onClick={() => navigate("/")} className="empty-back-btn">
                ← Explore Menu
              </button>
              <button onClick={selectAllItems} className="empty-bulk-btn">
                ⚡ Select All 32 Menu Items
              </button>
            </div>
          </div>
        ) : (
          food_list.map((item, index) => {
            if (cartItems && cartItems[item._id] > 0) {
              const imageSrc = (typeof item.image === 'string' && (item.image.startsWith('/') || item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.startsWith('data:')))
                  ? item.image
                  : `${url}/images/${item.image}`;

              return (
                <div key={item._id || index}>
                  <div className="cart-items-title cart-items-item">
                    <img className='cart-food-image' src={imageSrc} alt={`${item.name} item`} />
                    <p className='cart-food-name'>{item.name}</p>
                    <p>{currency}{item.price}</p>
                    <div className='cart-quantity'>{cartItems[item._id]}</div>
                    <p>{currency}{item.price * cartItems[item._id]}</p>
                    <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>×</p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        )}
      </div>


      {/* ================= CART BOTTOM ================= */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            <hr />
            {getDiscountAmount() > 0 && (
              <>
                <div className="cart-total-details promo-applied">
                  <p>Discount (20% promo)</p>
                  <p className="discount-value">-{currency}{getDiscountAmount()}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{currency}{getDiscountedTotal()}</b>
            </div>
          </div>
          <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <p>If you have a promo code, enter it here</p>
          {promoCode.trim().toLowerCase() !== "rohit02" && (
            <div className="promo-hint-badge animate-fade-in">
              <span>💡 OFFER</span> Use code <strong>rohit02</strong> to get <strong>20% OFF</strong> above ₹200!
            </div>
          )}
          {promoCode.trim().toLowerCase() === "rohit02" && getDiscountAmount() > 0 ? (
            <div className="promo-success-box card-glow">
              <div className="promo-success-text">
                <strong>🎉 Promo applied successfully!</strong>
                <span>20% off above ₹200 (₹{getDiscountAmount()} saved)</span>
              </div>
              <button onClick={handlePromoClear} className="promo-clear-btn">
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handlePromoSubmit} className='cart-promocode-input'>
              <input 
                type="text" 
                placeholder='Enter promo code (e.g. rohit02)' 
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;