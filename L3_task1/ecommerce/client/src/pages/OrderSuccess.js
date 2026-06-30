import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const navigate = useNavigate();
  return (
    <div className="success-page">
      <div className="success-icon">✅</div>
      <h1>Order placed!</h1>
      <p>Thank you for your purchase. We'll get it shipped out soon.</p>
      <button className="btn btn-primary" onClick={() => navigate("/products")}>
        Continue shopping
      </button>
    </div>
  );
}
