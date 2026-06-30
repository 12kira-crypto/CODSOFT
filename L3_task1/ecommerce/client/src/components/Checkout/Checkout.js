import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const emptyAddress = { street: "", city: "", postalCode: "", country: "" };

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState(emptyAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleField = (key, value) => setAddress((prev) => ({ ...prev, [key]: value }));

  const handleOrder = async () => {
    const allFilled = Object.values(address).every((v) => v.trim());
    if (!allFilled) return setError("Please fill in all address fields.");

    setLoading(true);
    setError("");
    try {
      const items = cart.map((i) => ({
        product: i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      }));
      await api.post("/orders", { items, shippingAddress: address, totalAmount: totalPrice });
      clearCart();
      navigate("/order-success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container checkout-page">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        <div className="checkout-form card">
          <h2>Shipping address</h2>
          <div className="form-group">
            <label>Street</label>
            <input
              placeholder="123 Main St"
              value={address.street}
              onChange={(e) => handleField("street", e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                placeholder="New York"
                value={address.city}
                onChange={(e) => handleField("city", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Postal code</label>
              <input
                placeholder="10001"
                value={address.postalCode}
                onChange={(e) => handleField("postalCode", e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              placeholder="United States"
              value={address.country}
              onChange={(e) => handleField("country", e.target.value)}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary place-order-btn" onClick={handleOrder} disabled={loading}>
            {loading ? "Placing order..." : `Place order — $${totalPrice.toFixed(2)}`}
          </button>
        </div>

        <aside className="checkout-summary card">
          <h2>Your items</h2>
          {cart.map((item) => (
            <div key={item._id} className="summary-item">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-item summary-item-total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
