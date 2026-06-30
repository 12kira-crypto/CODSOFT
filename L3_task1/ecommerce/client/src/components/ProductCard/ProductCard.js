import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addItem, cart } = useCart();
  const alreadyInCart = cart.some((i) => i._id === product._id);

  return (
    <div className="product-card card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} className="product-img" />
        <span className="badge badge-blue product-category">{product.category}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className={`btn ${alreadyInCart ? "btn-outline" : "btn-primary"} btn-sm`}
            onClick={() => addItem(product)}
          >
            {alreadyInCart ? "Add more" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
