import { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod")
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge, setShowLogin, getDiscountAmount, getDiscountedTotal } = useContext(StoreContext);

    const navigate = useNavigate();

    const autofillDemoAddress = () => {
        setData({
            firstName: "Rohit",
            lastName: "Kumar",
            email: "rohit@tomato.com",
            street: "123 Food Street, Sector 62",
            city: "Noida",
            state: "Uttar Pradesh",
            zipcode: "201301",
            country: "India",
            phone: "9876543210"
        });
        toast.info("Demo address autofilled successfully!");
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


    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        
        food_list.map((item) => {
            if (cartItems && cartItems[item._id] > 0) {
                // FIXED CRITICAL MUTATION CRASH: Clone object instead of modifying your core food_list reference
                let itemInfo = { ...item }; 
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
            return null;
        })

        let orderData = {
            address: data,
            items: orderItems,
            amount: getDiscountedTotal(),
        }

        const headers = token ? { headers: { token } } : {};

        if (payment === "stripe") {
            let response = await axios.post(url + "/api/order/place", orderData, headers);
            if (response.data.success) {
                const { orderId } = response.data;
                const totalAmount = getDiscountedTotal();
                navigate(`/payment?orderId=${orderId}&amount=${totalAmount}`);
            }
            else {
                toast.error("Something Went Wrong")
            }
        }
        else {
            let response = await axios.post(url + "/api/order/placecod", orderData, headers);
            if (response.data.success) {
                navigate("/myorders")
                toast.success(response.data.message)
                setCartItems({});
            }
            else {
                toast.error("Something Went Wrong")
            }
        }
    }

    useEffect(() => {
        if (!token) {
            toast.error("Please login to proceed to checkout");
            navigate('/cart');
            setShowLogin(true);
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token, getTotalCartAmount, navigate, setShowLogin])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
            </div>
            <div className="place-order-right">
                {/* ⚡ DEVELOPER SANDBOX CONTROLS */}
                <div className="developer-sandbox card-glow">
                    <div className="sandbox-header">
                        <span className="sandbox-badge">TESTING TOOLKIT</span>
                        <h3>Speed Checkout Helper</h3>
                        <p>Instantly bypass manual typing of address fields and select all 32 menu items in one click!</p>
                    </div>
                    <div className="sandbox-actions">
                        <button type="button" onClick={autofillDemoAddress} className="sandbox-btn fill-btn">
                            📝 Autofill Address
                        </button>
                        <button type="button" onClick={selectAllItems} className="sandbox-btn items-btn">
                            🍲 Select All 32 Items
                        </button>
                    </div>
                </div>

                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
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
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getDiscountedTotal()}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
            </div>
        </form>
    )
}

export default PlaceOrder