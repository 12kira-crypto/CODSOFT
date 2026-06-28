import { useState, useEffect } from "react";
import { api } from "../utils/api";
import ProductCard from "../components/ProductCard/ProductCard";
import Filter from "../components/Filter/Filter";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(
          Object.entries(filters).filter(([, v]) => v !== "")
        ).toString();
        const data = await api.get(`/products${params ? `?${params}` : ""}`);
        setProducts(data);
      } catch {
        console.error("Could not load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  return (
    <div className="container products-page">
      <div className="products-layout">
        <Filter filters={filters} onChange={setFilters} />
        <main>
          {loading ? (
            <div className="products-loading">Loading products…</div>
          ) : products.length === 0 ? (
            <div className="products-empty">No products match your filters.</div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
