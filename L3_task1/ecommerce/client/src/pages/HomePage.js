import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <span className="hero-eyebrow">New arrivals every week</span>
          <h1 className="hero-headline">
            Shop smarter.<br />Live better.
          </h1>
          <p className="hero-sub">
            Thousands of products across electronics, clothing, books, and more —
            all in one place.
          </p>
          <button className="btn btn-primary hero-cta" onClick={() => navigate("/products")}>
            Browse all products
          </button>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">🛍️</div>
        </div>
      </section>

      <section className="categories container">
        <h2>Shop by category</h2>
        <div className="category-grid">
          {[
            { label: "Electronics", emoji: "💻" },
            { label: "Clothing", emoji: "👗" },
            { label: "Books", emoji: "📚" },
            { label: "Home", emoji: "🏠" },
            { label: "Sports", emoji: "⚽" },
          ].map(({ label, emoji }) => (
            <button
              key={label}
              className="category-tile card"
              onClick={() => navigate(`/products?category=${label.toLowerCase()}`)}
            >
              <span className="category-emoji">{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
