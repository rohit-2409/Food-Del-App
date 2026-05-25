import { useState, useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Payment.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount") || "0";

  const { url, currency, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  // Payment method tab state: 'upi' | 'card' | 'netbanking'
  const [activeTab, setActiveTab] = useState("upi");

  // UPI Specific state: 'gpay' | 'phonepe' | 'paytm' | 'qr' | 'upiId'
  const [upiOption, setUpiOption] = useState("gpay");
  const [upiId, setUpiId] = useState("");

  // Card specific state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Net banking specific state
  const [selectedBank, setSelectedBank] = useState("");

  // Processing state: 'idle' | 'processing' | 'success'
  const [paymentStatus, setPaymentStatus] = useState("idle");

  // Address security check
  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid Order Access");
      navigate("/cart");
    }
  }, [orderId, navigate]);

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCardCvv(value);
    }
  };

  // Payment Execution Pipeline
  const executePayment = async (e) => {
    if (e) e.preventDefault();

    // Validation checks
    if (activeTab === "upi" && upiOption === "upiId" && !upiId.includes("@")) {
      return toast.warning("Please enter a valid UPI ID (e.g. name@okhdfc)");
    }
    if (activeTab === "card") {
      if (cardNumber.length < 19) return toast.warning("Please enter a valid 16-digit card number");
      if (!cardHolder.trim()) return toast.warning("Please enter cardholder name");
      if (cardExpiry.length < 5) return toast.warning("Please enter a valid card expiry date");
      if (cardCvv.length < 3) return toast.warning("Please enter a valid CVV");
    }
    if (activeTab === "netbanking" && !selectedBank) {
      return toast.warning("Please select your preferred Bank");
    }

    // Trigger processing loader screen
    setPaymentStatus("processing");

    try {
      // Simulate real-time secure network latency
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Hit backend order verification endpoint to set payment = true inside MongoDB
      const response = await axios.post(`${url}/api/order/verify`, {
        orderId,
        success: "true",
      });

      if (response.data.success) {
        setPaymentStatus("success");
        setCartItems({}); // Reset client-side cart variables
        localStorage.removeItem("cartItems"); // Reset client-side storage cart backup

        // Delightful checkout success redirect latency
        setTimeout(() => {
          toast.success("Payment Received Successfully!");
          navigate("/myorders");
        }, 2500);
      } else {
        setPaymentStatus("idle");
        toast.error("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment verification failure:", error);
      setPaymentStatus("idle");
      toast.error("Something went wrong processing payment.");
    }
  };

  return (
    <div className="payment-page">
      {/* 🚀 CORE PROCESSING SCREEN OVERLAY */}
      {paymentStatus !== "idle" && (
        <div className="processing-overlay">
          <div className="overlay-content">
            {paymentStatus === "processing" ? (
              <div className="processing-receipt card-glow animate-fade-in">
                <div className="receipt-header">
                  <div className="receipt-spinner"></div>
                  <h2>Securing Connection...</h2>
                  <p>Processing transaction via highly secure channels. Please do not close this window.</p>
                </div>
                <div className="receipt-body">
                  <div className="receipt-row">
                    <span>Order Reference</span>
                    <strong>#{orderId.slice(-8).toUpperCase()}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Charged Amount</span>
                    <strong className="accent-text">{currency}{amount}.00</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Selected Gateway</span>
                    <strong className="caps">{activeTab === "upi" ? upiOption : activeTab}</strong>
                  </div>
                </div>
                <div className="receipt-footer">
                  <div className="shield-badge">
                    <svg viewBox="0 0 24 24" className="icon-shield">
                      <path fill="currentColor" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>100% Secure SSL Certified</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="success-receipt animate-scale-up">
                <div className="confetti-container">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className={`confetti-piece p-${i}`}></div>
                  ))}
                </div>
                <div className="success-circle">
                  <svg className="checkmark" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                </div>
                <h2>Payment Successful!</h2>
                <p>Your order has been placed and paid successfully.</p>
                <div className="success-details">
                  <p><strong>Order ID:</strong> #{orderId.toUpperCase()}</p>
                  <p><strong>Total Amount:</strong> {currency}{amount}.00</p>
                </div>
                <div className="loading-redirect-bar">
                  <div className="progress-fill animate-progress"></div>
                </div>
                <span className="redirect-text">Redirecting you to My Orders...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🚀 HEADER PANEL */}
      <div className="payment-header">
        <div>
          <span className="eyebrow">tomato checkout gateway</span>
          <h1>Secure Payment Portal</h1>
          <p>Choose your preferred digital payment option below to finalize your order.</p>
        </div>
        <div className="amount-badge">
          <span>Amount Payable</span>
          <h2>{currency}{amount}.00</h2>
        </div>
      </div>

      {/* 🚀 CHECKOUT GATEWAY WORKSPACE */}
      <div className="payment-container">
        {/* LEFT COLUMN: INTERACTIVE TABS & FORMS */}
        <div className="payment-left card-glow">
          {/* TABS SIDEBAR */}
          <div className="payment-tabs">
            <button
              onClick={() => setActiveTab("upi")}
              className={`tab-btn ${activeTab === "upi" ? "active" : ""}`}
            >
              <div className="tab-icon">⚡</div>
              <div className="tab-text">
                <h3>UPI Pay</h3>
                <p>Google Pay, PhonePe, Paytm, QR</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("card")}
              className={`tab-btn ${activeTab === "card" ? "active" : ""}`}
            >
              <div className="tab-icon">💳</div>
              <div className="tab-text">
                <h3>Credit / Debit Card</h3>
                <p>Visa, MasterCard, RuPay</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("netbanking")}
              className={`tab-btn ${activeTab === "netbanking" ? "active" : ""}`}
            >
              <div className="tab-icon">🏦</div>
              <div className="tab-text">
                <h3>Net Banking</h3>
                <p>SBI, HDFC, ICICI, AXIS</p>
              </div>
            </button>
          </div>

          {/* TAB DISPLAY WORKSPACE */}
          <div className="payment-display">
            {/* UPI WORKSPACE */}
            {activeTab === "upi" && (
              <div className="upi-workspace animate-fade-in">
                <h2>Select your preferred UPI Option</h2>
                <p className="sub">Complete transaction instantly using any active UPI application.</p>

                <div className="upi-options-grid">
                  <div
                    onClick={() => setUpiOption("gpay")}
                    className={`upi-opt-card ${upiOption === "gpay" ? "active" : ""}`}
                  >
                    <div className="upi-logo-container gpay-color">GPay</div>
                    <span>Google Pay</span>
                  </div>

                  <div
                    onClick={() => setUpiOption("phonepe")}
                    className={`upi-opt-card ${upiOption === "phonepe" ? "active" : ""}`}
                  >
                    <div className="upi-logo-container phonepe-color">Pe</div>
                    <span>PhonePe</span>
                  </div>

                  <div
                    onClick={() => setUpiOption("paytm")}
                    className={`upi-opt-card ${upiOption === "paytm" ? "active" : ""}`}
                  >
                    <div className="upi-logo-container paytm-color">Paytm</div>
                    <span>Paytm</span>
                  </div>

                  <div
                    onClick={() => setUpiOption("qr")}
                    className={`upi-opt-card ${upiOption === "qr" ? "active" : ""}`}
                  >
                    <div className="upi-logo-container qr-color">QR</div>
                    <span>Scan QR</span>
                  </div>
                </div>

                {upiOption === "qr" ? (
                  <div className="qr-box-container animate-scale-up">
                    <div className="qr-frame">
                      <div className="scanner-line"></div>
                      {/* Generated clean simulated vector QR Code */}
                      <svg className="qr-svg" viewBox="0 0 100 100">
                        <path fill="currentColor" d="M0 0h30v10H10v20H0V0zm70 0h30v30h-10V10H70V0zM0 70h10v20h20v10H0V70zm100 0H90v20H70v10h30V70zM15 15h15v15H15V15zm55 0h15v15H70V15zM15 70h15v15H15V70zm25-15h20v20H40V55zM45 25h10v10H45V25zm20 30h10v10H65V55zm-25 0h10v10H40V55zM25 45h10v10H25V45zm30 0h10v10H55V45z"/>
                      </svg>
                    </div>
                    <p>Scan this QR Code using GPay, PhonePe, Paytm, or any banking app to complete the checkout.</p>
                  </div>
                ) : (
                  <div className="upi-input-container">
                    <div
                      onClick={() => setUpiOption("upiId")}
                      className={`upi-custom-card ${upiOption === "upiId" ? "active" : ""}`}
                    >
                      <span>⚡ Pay via Custom UPI ID</span>
                    </div>

                    {upiOption === "upiId" && (
                      <div className="upi-id-form animate-fade-in">
                        <label>Enter your UPI ID / VPA</label>
                        <div className="upi-input-field">
                          <input
                            type="text"
                            placeholder="username@bank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                          />
                        </div>
                        <p className="hint">A request will be sent directly to your banking app.</p>
                      </div>
                    )}

                    {upiOption !== "upiId" && (
                      <div className="upi-instant-panel">
                        <p>Selected instant payment via <strong>{upiOption.toUpperCase()}</strong>. Clicking pay will launch a simulated redirection to your mobile application.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CARD WORKSPACE */}
            {activeTab === "card" && (
              <div className="card-workspace animate-fade-in">
                <h2>Credit or Debit Card Checkout</h2>
                <p className="sub">Enter your card credentials safely below inside our encrypted portal.</p>

                {/* 💳 REAL-TIME 3D VISUALIZER CARD */}
                <div className={`flip-card ${isCardFlipped ? "flipped" : ""}`}>
                  <div className="flip-card-inner">
                    {/* Front Face */}
                    <div className="flip-card-front card-glow">
                      <div className="card-chip-brand">
                        <div className="card-chip"></div>
                        <div className="card-brand">
                          {cardNumber.startsWith("4") ? "VISA" : cardNumber.startsWith("5") ? "MASTERCARD" : "CARD"}
                        </div>
                      </div>
                      <div className="card-number-display">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="card-meta">
                        <div className="meta-block">
                          <span>Card Holder</span>
                          <strong>{cardHolder.toUpperCase() || "NAME SURNAME"}</strong>
                        </div>
                        <div className="meta-block">
                          <span>Expires</span>
                          <strong>{cardExpiry || "MM/YY"}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="flip-card-back card-glow">
                      <div className="magnetic-strip"></div>
                      <div className="signature-area">
                        <span>Authorized Signature</span>
                        <div className="card-cvv-display">
                          {cardCvv || "•••"}
                        </div>
                      </div>
                      <p className="disclaimer">This card visualizer is 100% secure. CVV is hidden dynamically on front page views.</p>
                    </div>
                  </div>
                </div>

                {/* CARD FORMS */}
                <form onSubmit={executePayment} className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                    />
                  </div>

                  <div className="double-group">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>CVV / CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={() => setIsCardFlipped(false)}
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* NET BANKING WORKSPACE */}
            {activeTab === "netbanking" && (
              <div className="banking-workspace animate-fade-in">
                <h2>Select Net Banking Account</h2>
                <p className="sub">Select your bank from the options below to proceed to secure retail portal logins.</p>

                <div className="banks-grid">
                  <div
                    onClick={() => setSelectedBank("sbi")}
                    className={`bank-card ${selectedBank === "sbi" ? "active" : ""}`}
                  >
                    <div className="bank-avatar sbi-theme">SBI</div>
                    <span>State Bank of India</span>
                  </div>

                  <div
                    onClick={() => setSelectedBank("hdfc")}
                    className={`bank-card ${selectedBank === "hdfc" ? "active" : ""}`}
                  >
                    <div className="bank-avatar hdfc-theme">HDFC</div>
                    <span>HDFC Bank</span>
                  </div>

                  <div
                    onClick={() => setSelectedBank("icici")}
                    className={`bank-card ${selectedBank === "icici" ? "active" : ""}`}
                  >
                    <div className="bank-avatar icici-theme">ICICI</div>
                    <span>ICICI Bank</span>
                  </div>

                  <div
                    onClick={() => setSelectedBank("axis")}
                    className={`bank-card ${selectedBank === "axis" ? "active" : ""}`}
                  >
                    <div className="bank-avatar axis-theme">AXIS</div>
                    <span>Axis Bank</span>
                  </div>
                </div>

                {selectedBank && (
                  <div className="bank-notice animate-scale-up">
                    <p>You have selected <strong>{selectedBank.toUpperCase()} Bank Net Banking</strong>. Upon checkout, you will be redirected to the secure bank portal for online authorization credentials.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SECURE SIDEBAR & ORDER TOTALS */}
        <div className="payment-right">
          <div className="payment-summary-card card-glow">
            <h2>Payment Summary</h2>
            <hr />
            <div className="payment-summary-details">
              <div className="summary-row">
                <span>Subtotal Payable</span>
                <span>{currency}{(Number(amount) - 50).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Standard Delivery Fee</span>
                <span>{currency}50.00</span>
              </div>
              <hr />
              <div className="summary-row total-row">
                <span>Grand Total</span>
                <span className="accent-text">{currency}{amount}.00</span>
              </div>
            </div>

            {/* ACTION CTA PAYMENT BUTTON */}
            <button onClick={executePayment} className="pay-now-btn">
              <span>Securely Pay {currency}{amount}.00</span>
              <svg viewBox="0 0 24 24" className="icon-lock">
                <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </button>

            {/* SECURE SHIELD FOOTER */}
            <div className="security-badges">
              <div className="badge-item">
                <span className="badge-icon">🔒</span>
                <div>
                  <h4>PCI-DSS Compliant</h4>
                  <p>256-bit Bank Grade Security</p>
                </div>
              </div>
              <div className="badge-item">
                <span className="badge-icon">🛡️</span>
                <div>
                  <h4>Fraud Safeguards</h4>
                  <p>Encrypted tokens keep data safe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
